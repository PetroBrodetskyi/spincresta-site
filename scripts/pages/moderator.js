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
  const deleteReview = createElement('button', 'moderation-action moderation-action-delete', 'Delete review');
  deleteReview.type = 'button';
  const message = createElement('span', 'moderation-card-message');
  message.setAttribute('role', 'status');
  actions.append(approve, reject, deleteReview, message);
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
    deleteReview.disabled = true;
    message.textContent = action === 'approve' ? 'Approving…' : 'Rejecting…';
    try {
      await onModerate(review.id, action, textarea.value, editedTitle, editedBody);
      article.remove();
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Could not update review.';
      approve.disabled = false;
      reject.disabled = false;
      deleteReview.disabled = false;
    }
  };
  approve.addEventListener('click', () => moderate('approve'));
  reject.addEventListener('click', () => moderate('reject'));

  deleteReview.addEventListener('click', async () => {
    const confirmed = window.confirm(
      'Permanently delete this written player review? Its separate star rating will remain. Any official responses attached to this review will also be deleted.'
    );
    if (!confirmed) return;
    approve.disabled = true;
    reject.disabled = true;
    deleteReview.disabled = true;
    message.textContent = 'Deleting review…';
    try {
      await onModerate(review.id, 'delete_review');
      article.remove();
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Could not delete review.';
      approve.disabled = false;
      reject.disabled = false;
      deleteReview.disabled = false;
    }
  });

  article.append(meta, author, content);

  const replies = Array.isArray(review.replies) ? review.replies : [];
  if (replies.length) {
    const replySection = createElement('section', 'moderation-replies');
    replySection.append(createElement('h3', '', 'Official brand responses'));
    replies.forEach(reply => {
      const replyCard = createElement('article', 'moderation-reply-card');
      const replyHeader = createElement('div', 'moderation-reply-header');
      const replyAuthor = createElement('strong', '', reply.author?.displayName || 'Brand representative');
      replyHeader.append(replyAuthor, createElement('time', '', formatDate(reply.createdAt)));
      const replyBody = createElement('p', '', reply.body);
      const replyActions = createElement('div', 'moderation-reply-actions');
      const deleteReply = createElement('button', 'moderation-action moderation-action-delete', 'Delete response');
      deleteReply.type = 'button';
      const replyMessage = createElement('span', 'moderation-card-message');
      replyMessage.setAttribute('role', 'status');
      deleteReply.addEventListener('click', async () => {
        if (!window.confirm('Permanently delete this official brand response?')) return;
        deleteReply.disabled = true;
        replyMessage.textContent = 'Deleting response…';
        try {
          await onModerate(review.id, 'delete_reply', '', '', '', reply.id);
          replyCard.remove();
          if (!replySection.querySelector('.moderation-reply-card')) replySection.remove();
        } catch (error) {
          replyMessage.textContent = error instanceof Error ? error.message : 'Could not delete response.';
          deleteReply.disabled = false;
        }
      });
      replyActions.append(deleteReply, replyMessage);
      replyCard.append(replyHeader, replyBody, replyActions);
      replySection.append(replyCard);
    });
    article.append(replySection);
  }

  article.append(controls);
  return article;
};

export const newsletterStatusLabel = status => {
  const text = typeof status === 'string' ? status.replace(/[_-]+/g, ' ').trim().toLowerCase() : '';
  return text ? text[0].toUpperCase() + text.slice(1) : 'Not subscribed';
};

const userCard = (user, brands, onSaveRole) => {
  const row = createElement('article', 'moderation-user-card');
  const identityCell = createElement('header', 'moderation-user-card-heading');
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
  if (Array.isArray(user.representativeBrands) && user.representativeBrands.length) labels.append(createElement('em', 'is-representative', 'Brand representative'));
  identityText.append(labels);
  identity.append(identityText);
  identityCell.append(identity);

  const facts = createElement('dl', 'account-profile-facts moderation-user-facts');
  const fact = (label, value = '') => {
    const item = createElement('div');
    const details = createElement('dd', '', value);
    item.append(createElement('dt', '', label), details);
    facts.append(item);
    return details;
  };
  fact('Country', user.countryCode || '—');
  const phone = fact('Phone');
  if (user.phoneNumber) {
    const phoneLink = createElement('a', '', user.phoneNumber);
    phoneLink.href = `tel:${user.phoneNumber.replace(/[^+\d]/g, '')}`;
    phone.append(phoneLink);
  } else phone.textContent = '—';
  const telegram = fact('Telegram');
  if (user.telegramUsername) {
    const telegramLink = createElement('a', '', `@${user.telegramUsername}`);
    telegramLink.href = `https://t.me/${user.telegramUsername}`;
    telegramLink.target = '_blank';
    telegramLink.rel = 'noopener';
    telegram.append(telegramLink);
  } else telegram.textContent = '—';
  fact('Registered', formatDate(user.registeredAt));
  fact('Last sign-in', formatDate(user.lastSignInAt));
  fact('Newsletter', newsletterStatusLabel(user.newsletterStatus));
  const accessCell = createElement('div', 'moderation-user-access');
  const roleSelect = document.createElement('select');
  roleSelect.setAttribute('aria-label', `Brand access: ${user.displayName || 'SpinCresta player'}`);
  roleSelect.innerHTML = '<option value="user">Player</option><option value="brand_representative">Brand representative</option>';
  roleSelect.value = user.representativeBrands?.length ? 'brand_representative' : 'user';
  const brandPicker = document.createElement('details');
  brandPicker.className = 'moderation-brand-picker';
  const brandSummary = document.createElement('summary');
  const brandPanel = createElement('div', 'moderation-brand-picker-panel');
  const brandSearch = document.createElement('input');
  brandSearch.type = 'search';
  brandSearch.placeholder = 'Search brands';
  brandSearch.setAttribute('aria-label', 'Search brands');
  const brandOptions = createElement('div', 'moderation-brand-options');
  const assigned = new Set((user.representativeBrands || []).map(brand => brand.slug));
  const checkboxes = [];

  const updateBrandSummary = () => {
    const selectedCount = checkboxes.filter(checkbox => checkbox.checked).length;
    brandSummary.textContent = selectedCount
      ? `${selectedCount} brand${selectedCount === 1 ? '' : 's'} selected`
      : 'Choose brands';
  };

  brands.forEach(brand => {
    const label = document.createElement('label');
    label.dataset.search = `${brand.name} ${brand.slug}`.toLowerCase();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = brand.slug;
    checkbox.checked = assigned.has(brand.slug);
    checkbox.addEventListener('change', updateBrandSummary);
    checkboxes.push(checkbox);
    label.append(checkbox, createElement('span', '', brand.name));
    brandOptions.append(label);
  });
  updateBrandSummary();
  brandSearch.addEventListener('input', () => {
    const query = brandSearch.value.trim().toLowerCase();
    Array.from(brandOptions.children).forEach(option => {
      option.hidden = Boolean(query) && !option.dataset.search.includes(query);
    });
  });
  brandPanel.append(brandSearch, brandOptions);
  brandPicker.append(brandSummary, brandPanel);
  brandPicker.addEventListener('toggle', () => {
    if (!brandPicker.open) return;
    document.querySelectorAll('.moderation-brand-picker[open]').forEach(picker => {
      if (picker !== brandPicker) picker.open = false;
    });
  });
  brandPicker.hidden = roleSelect.value !== 'brand_representative';
  roleSelect.addEventListener('change', () => {
    brandPicker.hidden = roleSelect.value !== 'brand_representative';
    if (brandPicker.hidden) brandPicker.open = false;
  });
  const save = createElement('button', '', 'Save role');
  save.type = 'button';
  const message = createElement('small');
  save.addEventListener('click', async () => {
    const brandSlugs = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    if (roleSelect.value === 'brand_representative' && !brandSlugs.length) { message.textContent = 'Choose at least one brand.'; return; }
    save.disabled = true;
    message.textContent = 'Saving…';
    try {
      await onSaveRole(user.userId, roleSelect.value, brandSlugs);
      brandPicker.open = false;
      message.textContent = 'Saved';
    } catch { message.textContent = 'Could not save'; save.disabled = false; }
  });
  accessCell.append(roleSelect, brandPicker, save, message);
  row.append(identityCell, facts, accessCell);
  row.dataset.search = [user.displayName, user.email, user.countryCode, user.phoneNumber, user.telegramUsername]
    .filter(Boolean).join(' ').toLowerCase();
  return row;
};

export const initModeratorPage = async () => {
  const root = document.querySelector('[data-moderator-page]');
  if (!root) return;

  document.addEventListener('click', event => {
    root.querySelectorAll('.moderation-brand-picker[open]').forEach(picker => {
      if (!picker.contains(event.target)) picker.open = false;
    });
  });

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
  let availableBrands = [];
  let accessRequest = 0;
  let usersRequest = 0;
  let reviewsRequest = 0;

  const showNotice = (message, state = '') => {
    notice.textContent = message;
    notice.dataset.state = state;
    notice.hidden = !message;
  };

  const showAccess = message => {
    accessToken = '';
    usersLoaded = false;
    availableBrands = [];
    showNotice('');
    usersList.replaceChildren();
    usersList.hidden = true;
    userTotal.textContent = '';
    list.replaceChildren();
    loading.hidden = true;
    usersLoading.hidden = true;
    list.hidden = true;
    empty.hidden = true;
    panels.forEach(panel => {
      panel.hidden = true;
      panel.removeAttribute('aria-busy');
    });
    access.querySelector('p').textContent = message;
    signIn.textContent = account?.getState().signedIn
      ? 'Open account / switch user'
      : 'Sign in with Google';
    access.hidden = false;
  };

  const filterUsers = () => {
    if (!usersLoaded) return;
    const query = userSearch.value.trim().toLowerCase();
    const rows = Array.from(usersList.children);
    let visible = 0;
    rows.forEach(row => {
      row.hidden = Boolean(query) && !row.dataset.search.includes(query);
      if (!row.hidden) visible += 1;
    });
    usersEmpty.hidden = visible !== 0;
    usersList.hidden = visible === 0;
  };

  const loadUsers = async ({ force = false } = {}) => {
    const token = accessToken;
    if (!token || usersLoaded && !force) return;
    const request = ++usersRequest;
    const generation = accessRequest;
    const isCurrent = () => request === usersRequest && generation === accessRequest && token === accessToken;
    usersLoaded = false;
    usersLoading.hidden = false;
    const panel = usersLoading.closest('[data-moderator-panel]');
    panel.setAttribute('aria-busy', 'true');
    usersEmpty.hidden = true;
    usersList.hidden = true;
    userTotal.textContent = '';
    usersList.replaceChildren();
    let response, body;
    try {
      response = await fetch(`${usersEndpoint}?limit=100&offset=0`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      body = await response.json().catch(() => ({}));
    } catch { /* show a retryable error below */ }
    if (!isCurrent()) return;
    usersLoading.hidden = true;
    panel.removeAttribute('aria-busy');
    if (!response) {
      usersEmpty.textContent = 'Could not load registered users. Select Refresh to try again.';
      usersEmpty.hidden = false;
      return;
    }
    if (response.status === 401) return showAccess('Sign in with an approved moderator account to continue.');
    if (response.status === 403) return showAccess('This account does not have moderator access.');
    if (!response.ok) return showAccess('The registered-user directory is temporarily unavailable. Please try again.');
    const users = Array.isArray(body.users) ? body.users : [];
    availableBrands = Array.isArray(body.brands) ? body.brands : [];
    const saveRole = async (userId, role, brandSlugs) => {
      if (!isCurrent()) throw new Error('role_request_expired');
      const roleResponse = await fetch(usersEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role, brandSlugs }),
      });
      if (!roleResponse.ok || !isCurrent()) throw new Error('role_update_failed');
      usersLoaded = false;
      await loadUsers({ force: true });
      showNotice('Brand representative access updated.', 'success');
    };
    users.forEach(user => usersList.append(userCard(user, availableBrands, saveRole)));
    const count = body.pagination?.total ?? users.length;
    userTotal.textContent = `${count} ${count === 1 ? 'user' : 'users'}`;
    usersEmpty.textContent = 'No registered users found.';
    usersLoaded = true;
    filterUsers();
  };

  const openView = async view => {
    currentView = view === 'users' ? 'users' : 'reviews';
    viewButtons.forEach(button => {
      const active = button.dataset.moderatorView === currentView;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = !access.hidden || panel.dataset.moderatorPanel !== currentView; });
    if (!accessToken) return;
    if (currentView === 'users') await loadUsers();
    else await loadReviews(currentStatus);
  };

  const moderate = async (reviewId, action, note = '', title = '', reviewBody = '', replyId = '') => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reviewId, replyId, action, note, title, body: reviewBody }),
    });
    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (responseBody.error === 'review_not_found') throw new Error('This review no longer exists.');
      if (responseBody.error === 'reply_not_found') throw new Error('This official response no longer exists.');
      throw new Error(action.startsWith('delete_')
        ? 'Could not delete this content. Please try again.'
        : 'Could not update this review. Please try again.');
    }
    const notices = {
      approve: 'Review approved and published.',
      reject: 'Review rejected.',
      delete_review: 'Written player review permanently deleted. Its star rating was kept.',
      delete_reply: 'Official brand response permanently deleted.',
    };
    showNotice(notices[action] || 'Moderation action completed.', 'success');
  };

  const loadReviews = async status => {
    const token = accessToken;
    if (!token) return;
    const request = ++reviewsRequest;
    const generation = accessRequest;
    currentStatus = STATUSES.includes(status) ? status : 'pending';
    filters.forEach(button => {
      const active = button.dataset.moderatorStatus === currentStatus;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    loading.hidden = false;
    const panel = loading.closest('[data-moderator-panel]');
    panel.setAttribute('aria-busy', 'true');
    access.hidden = true;
    empty.hidden = true;
    list.hidden = true;
    list.replaceChildren();
    showNotice('');

    let response, body;
    try {
      response = await fetch(`${endpoint}?status=${currentStatus}&limit=50`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      body = await response.json().catch(() => ({}));
    } catch { /* show a retryable error below */ }
    if (request !== reviewsRequest || generation !== accessRequest || token !== accessToken) return;
    loading.hidden = true;
    panel.removeAttribute('aria-busy');

    if (!response) {
      empty.textContent = 'Could not load reviews. Select a status to try again.';
      empty.hidden = false;
      return;
    }

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
  viewButtons.forEach((button, index) => {
    button.addEventListener('click', () => openView(button.dataset.moderatorView));
    button.addEventListener('keydown', event => {
      const last = viewButtons.length - 1;
      const target = { Home: 0, End: last, ArrowUp: index ? index - 1 : last, ArrowDown: index === last ? 0 : index + 1 }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      viewButtons[target].focus();
      openView(viewButtons[target].dataset.moderatorView);
    });
  });
  userSearch.addEventListener('input', filterUsers);
  userRefresh.addEventListener('click', () => loadUsers({ force: true }));

  const syncAccess = async () => {
    const request = ++accessRequest;
    accessToken = '';
    if (!account?.getState().signedIn) {
      showAccess('Sign in with an approved moderator account to continue.');
      return;
    }
    const token = await account.getAccessToken();
    if (request !== accessRequest) return;
    accessToken = token;
    if (!accessToken) {
      showAccess('Your session has expired. Sign in again to continue.');
      return;
    }
    access.hidden = true;
    usersLoaded = false;
    await openView(currentView);
  };

  account = await waitForAccount();
  window.addEventListener('spincresta:account-state', () => {
    if (!account) account = window.SpinCrestaAccount || null;
    syncAccess().catch(() => {
      showAccess('The moderation queue is temporarily unavailable. Please try again.');
    });
  });
  await syncAccess();
};
