const DEFAULT_MODERATION_ENDPOINT = 'https://api.spincresta.com/api/moderation-reviews';
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
  if (review.title) content.append(createElement('h3', '', review.title));
  content.append(createElement('p', '', review.body));

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
    approve.disabled = true;
    reject.disabled = true;
    message.textContent = action === 'approve' ? 'Approving…' : 'Rejecting…';
    try {
      await onModerate(review.id, action, textarea.value);
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
  const endpoint = document.documentElement.dataset.moderationEndpoint
    || DEFAULT_MODERATION_ENDPOINT;
  let account = null;
  let currentStatus = 'pending';
  let accessToken = '';

  const showNotice = (message, state = '') => {
    notice.textContent = message;
    notice.dataset.state = state;
    notice.hidden = !message;
  };

  const showAccess = message => {
    loading.hidden = true;
    list.hidden = true;
    empty.hidden = true;
    access.querySelector('p').textContent = message;
    signIn.textContent = account?.getState().signedIn
      ? 'Open account / switch user'
      : 'Sign in with Google';
    access.hidden = false;
  };

  const moderate = async (reviewId, action, note) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reviewId, action, note }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error === 'review_not_found'
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

  account = await waitForAccount();
  if (!account?.getState().signedIn) {
    showAccess('Sign in with an approved moderator account to continue.');
    return;
  }
  accessToken = await account.getAccessToken();
  if (!accessToken) {
    showAccess('Your session has expired. Sign in again to continue.');
    return;
  }
  await loadReviews(currentStatus);
};
