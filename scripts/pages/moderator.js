const DEFAULT_MODERATION_ENDPOINT = 'https://api.spincresta.com/api/moderation-reviews';
const DEFAULT_USERS_ENDPOINT = 'https://api.spincresta.com/api/moderation-users';
const STATUSES = ['pending', 'approved', 'rejected'];

const waitForAccount = () => {
  if (window.SpinCrestaAccount) return Promise.resolve(window.SpinCrestaAccount);

  return new Promise(resolve => {
    const timeout = window.setTimeout(() => resolve(null), 10000);
    window.addEventListener('spincresta:account-ready', () => {
      window.clearTimeout(timeout);
      resolve(window.SpinCrestaAccount || null);
    }, { once: true });
  });
};

const formatDate = value => {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const starLabel = rating => rating
  ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} ${rating}/5`
  : 'No rating';

const reviewCard = (review, onModerate) => {
  const article = createElement('article', 'moderation-review-card');
  article.dataset.reviewId = review.id;

  const meta = createElement('div', 'moderation-review-meta');
  const brandLink = createElement('a', 'moderation-brand-link', review.brand.name);
  brandLink.href = `/brands/${review.brand.slug}/`;
  brandLink.target = '_blank';
  brandLink.rel = 'noopener';
  meta.append(brandLink);
  meta.append(createElement('span', 'moderation-status-pill', review.status));
  meta.append(createElement('span', 'moderation-rating', starLabel(review.rating)));

  const author = createElement('div', 'moderation-author');
  if (review.author.avatarUrl) {
    const avatar = document.createElement('img');
    avatar.src = review.author.avatarUrl;
    avatar.alt = '';
    avatar.loading = 'lazy';
    author.append(avatar);
  }
  const authorText = createElement('div');
  authorText.append(createElement('strong', '', review.author.displayName));
  authorText.append(createElement('span', '', `${review.language.toUpperCase()} · ${formatDate(review.createdAt)}`));
  author.append(authorText);

  const content = createElement('div', 'moderation-review-content');
  const editingHint = createElement(
    'p',
    'moderation-editing-hint',
    'You may remove links or personal details and correct obvious mistakes. Keep the player’s meaning unchanged.'
  );
  content.append(editingHint);

  const titleLabel = createElement('label');
  titleLabel.append(createElement('span', '', 'Public review title'));
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.minLength = 3;
  titleInput.maxLength = 120;
  titleInput.placeholder = 'Optional title';
  titleInput.value = review.title || '';
  titleLabel.append(titleInput);
  content.append(titleLabel);

  const bodyLabel = createElement('label');
  bodyLabel.append(createElement('span', '', 'Public review text'));
  const bodyTextarea = document.createElement('textarea');
  bodyTextarea.rows = 6;
  bodyTextarea.minLength = 20;
  bodyTextarea.maxLength = 5000;
  bodyTextarea.required = true;
  bodyTextarea.value = review.body;
  bodyLabel.append(bodyTextarea);
  content.append(bodyLabel);

  const controls = createElement('div', 'moderation-review-controls');
  const label = createElement('label');
  label.append(createElement('span', '', 'Moderator note (internal)'));
  const textarea = document.createElement('textarea');
  textarea.rows = 3;
  textarea.maxLength = 1000;
  textarea.placeholder = 'Optional reason or internal note';
  textarea.value = review.moderatorNote || '';
  label.append(textarea);
  controls.append(label);

  const actions = createElement('div', 'moderation-review-actions');
  const approve = createElement('button', 'moderation-action moderation-action-approve', 'Approve');
  approve.type = 'button';
  const reject = createElement('button', 'moderation-action', 'Reject');
  reject.type = 'button';
  const message = createElement('span', 'moderation-card-message');
  message.setAttribute('role', 'status');
  actions.append(approve, reject, message);
  controls.append(actions);

  const moderate = async action => {
    const editedTitle = titleInput.value.trim();
    const editedBody = bodyTextarea.value.trim();
    if ((editedTitle && editedTitle.length < 3) || editedTitle.length > 120) {
      message.textContent = 'The public title must contain 3–120 characters or be left empty.';
      titleInput.focus();
      return;
    }
    if (editedBody.length < 20 || editedBody.length > 5000) {
      message.textContent = 'The public review text must contain 20–5,000 characters.';
      bodyTextarea.focus();
      return;
    }
    approve.disabled = true;
    reject.disabled = true;
    message.textContent = action === 'approve' ? 'Approving…' : 'Rejecting…';
    try {
      await onModerate(review.id, action, textarea.value, editedTitle, editedBody);
      article.remove();
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Could not update review.';
      approve.disabled = false;
      reject.disabled = false;
    }
  };
  approve.addEventListener('click', () => moderate('approve'));
  reject.addEventListener('click', () => moderate('reject'));

  article.append(meta, author, content, controls);
  return article;
};

const userRow = user => {
  const row = document.createElement('tr');
  const identityCell = document.createElement('td');
  const identity = createElement('div', 'moderation-user-identity');
  if (user.avatarUrl) {
    const avatar = document.createElement('img');
    avatar.src = user.avatarUrl;
    avatar.alt = '';
    avatar.loading = 'lazy';
    identity.append(avatar);
  }
  const identityText = createElement('div');
  identityText.append(createElement('strong', '', user.displayName || 'SpinCresta player'));
  identityText.append(createElement('a', '', user.email));
  identityText.lastElementChild.href = `mailto:${user.email}`;
  const labels = createElement('span', 'moderation-user-labels');
  labels.append(createElement('em', '', (user.locale || 'en').toUpperCase()));
  if (user.role === 'moderator') labels.append(createElement('em', 'is-moderator', 'Moderator'));
  identityText.append(labels);
  identity.append(identityText);
  identityCell.append(identity);

  const country = createElement('td', '', user.countryCode || '—');
  const phone = createElement('td');
  if (user.phoneNumber) {
    const phoneLink = createElement('a', '', user.phoneNumber);
    phoneLink.href = `tel:${user.phoneNumber.replace(/[^+\d]/g, '')}`;
    phone.append(phoneLink);
  } else phone.textContent = '—';
  const telegram = createElement('td');
  if (user.telegramUsername) {
    const telegramLink = createElement('a', '', `@${user.telegramUsername}`);
    telegramLink.href = `https://t.me/${user.telegramUsername}`;
    telegramLink.target = '_blank';
    telegramLink.rel = 'noopener';
    telegram.append(telegramLink);
  } else telegram.textContent = '—';
  const newsletter = createElement('td');
  newsletter.append(createElement('span', `moderation-status-pill is-${user.newsletterStatus || 'not-subscribed'}`, user.newsletterStatus || 'Not subscribed'));
  row.append(identityCell, country, phone, telegram, newsletter, createElement('td', '', formatDate(user.registeredAt)), createElement('td', '', formatDate(user.lastSignInAt)));
  row.dataset.search = [user.displayName, user.email, user.countryCode, user.phoneNumber, user.telegramUsername]
    .filter(Boolean).join(' ').toLowerCase();
  return row;
};

export const initModeratorPage = async () => {
  const root = document.querySelector('[data-moderator-page]');
  if (!root) return;

  const loading = root.querySelector('[data-moderator-loading]');
  const access = root.querySelector('[data-moderator-access]');
  const list = root.querySelector('[data-moderator-list]');
  const empty = root.querySelector('[data-moderator-empty]');
  const notice = root.querySelector('[data-moderator-notice]');
  const signIn = root.querySelector('[data-moderator-signin]');
  const filters = Array.from(root.querySelectorAll('[data-moderator-status]'));
  const viewButtons = Array.from(root.querySelectorAll('[data-moderator-view]'));
  const panels = Array.from(root.querySelectorAll('[data-moderator-panel]'));
  const usersLoading = root.querySelector('[data-moderator-users-loading]');
  const usersEmpty = root.querySelector('[data-moderator-users-empty]');
  const usersTable = root.querySelector('[data-moderator-users-table]');
  const usersList = root.querySelector('[data-moderator-users-list]');
  const userSearch = root.querySelector('[data-moderator-user-search]');
  const userTotal = root.querySelector('[data-moderator-user-total]');
  const userRefresh = root.querySelector('[data-moderator-user-refresh]');
  const endpoint = document.documentElement.dataset.moderationEndpoint
    || DEFAULT_MODERATION_ENDPOINT;
  const usersEndpoint = document.documentElement.dataset.moderationUsersEndpoint
    || DEFAULT_USERS_ENDPOINT;
  let account = null;
  let currentStatus = 'pending';
  let accessToken = '';
  let currentView = 'reviews';
  let usersLoaded = false;

  const showNotice = (message, state = '') => {
    notice.textContent = message;
    notice.dataset.state = state;
    notice.hidden = !message;
  };

  const showAccess = message => {
    loading.hidden = true;
    usersLoading.hidden = true;
    list.hidden = true;
    empty.hidden = true;
    access.querySelector('p').textContent = message;
    signIn.textContent = account?.getState().signedIn
      ? 'Open account / switch user'
      : 'Sign in with Google';
    access.hidden = false;
  };

  const filterUsers = () => {
    const query = userSearch.value.trim().toLowerCase();
    const rows = Array.from(usersList.children);
    let visible = 0;
    rows.forEach(row => {
      row.hidden = Boolean(query) && !row.dataset.search.includes(query);
      if (!row.hidden) visible += 1;
    });
    usersEmpty.hidden = visible !== 0;
    usersTable.hidden = visible === 0;
  };

  const loadUsers = async ({ force = false } = {}) => {
    if (usersLoaded && !force) return;
    usersLoading.hidden = false;
    usersEmpty.hidden = true;
    usersTable.hidden = true;
    usersList.replaceChildren();
    const response = await fetch(`${usersEndpoint}?limit=100&offset=0`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
    });
    const body = await response.json().catch(() => ({}));
    usersLoading.hidden = true;
    if (response.status === 401) return showAccess('Sign in with an approved moderator account to continue.');
    if (response.status === 403) return showAccess('This account does not have moderator access.');
    if (!response.ok) return showAccess('The registered-user directory is temporarily unavailable. Please try again.');
    const users = Array.isArray(body.users) ? body.users : [];
    users.forEach(user => usersList.append(userRow(user)));
    userTotal.textContent = `${body.pagination?.total ?? users.length} users`;
    usersLoaded = true;
    filterUsers();
  };

  const openView = async view => {
    currentView = view === 'users' ? 'users' : 'reviews';
    viewButtons.forEach(button => {
      const active = button.dataset.moderatorView === currentView;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.moderatorPanel !== currentView; });
    if (!accessToken) return;
    if (currentView === 'users') await loadUsers();
    else await loadReviews(currentStatus);
  };

  const moderate = async (reviewId, action, note, title, reviewBody) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reviewId, action, note, title, body: reviewBody }),
    });
    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(responseBody.error === 'review_not_found'
      ? 'This review no longer exists.'
      : 'Could not update this review. Please try again.');
    showNotice(action === 'approve' ? 'Review approved and published.' : 'Review rejected.', 'success');
  };

  const loadReviews = async status => {
    currentStatus = STATUSES.includes(status) ? status : 'pending';
    filters.forEach(button => {
      const active = button.dataset.moderatorStatus === currentStatus;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    loading.hidden = false;
    access.hidden = true;
    empty.hidden = true;
    list.hidden = true;
    list.replaceChildren();
    showNotice('');

    const response = await fetch(`${endpoint}?status=${currentStatus}&limit=50`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const body = await response.json().catch(() => ({}));
    loading.hidden = true;

    if (response.status === 401) {
      showAccess('Sign in with an approved moderator account to continue.');
      return;
    }
    if (response.status === 403) {
      showAccess('This account does not have moderator access.');
      return;
    }
    if (!response.ok) {
      showAccess('The moderation queue is temporarily unavailable. Please try again.');
      return;
    }

    const reviews = Array.isArray(body.reviews) ? body.reviews : [];
    reviews.forEach(review => list.append(reviewCard(review, moderate)));
    list.hidden = reviews.length === 0;
    empty.hidden = reviews.length !== 0;
    empty.textContent = currentStatus === 'pending'
      ? 'No reviews are waiting for moderation.'
      : `No ${currentStatus} reviews found.`;
  };

  signIn.addEventListener('click', () => account?.openSignIn());
  filters.forEach(button => {
    button.addEventListener('click', () => loadReviews(button.dataset.moderatorStatus));
  });
  viewButtons.forEach(button => button.addEventListener('click', () => openView(button.dataset.moderatorView)));
  userSearch.addEventListener('input', filterUsers);
  userRefresh.addEventListener('click', () => loadUsers({ force: true }));

  const syncAccess = async () => {
    accessToken = '';
    if (!account?.getState().signedIn) {
      showAccess('Sign in with an approved moderator account to continue.');
      return;
    }
    accessToken = await account.getAccessToken();
    if (!accessToken) {
      showAccess('Your session has expired. Sign in again to continue.');
      return;
    }
    access.hidden = true;
    if (currentView === 'users') await loadUsers({ force: true });
    else await loadReviews(currentStatus);
  };

  account = await waitForAccount();
  await syncAccess();
  window.addEventListener('spincresta:account-state', () => {
    syncAccess().catch(() => {
      showAccess('The moderation queue is temporarily unavailable. Please try again.');
    });
  });
};
