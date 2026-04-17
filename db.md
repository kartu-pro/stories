# content
stories: id, length (# scenes)
scenes: id, story_id, scene_index, image_id
versions: id, story_id, lang_code, title
sentences: id, scene_id, version_id, audio_id, text, source_id
publications: version_id, is_published, created_on, author_id, cost

# questions
focuses: id, name, suggested_by, approved_by, approved_at
questions: id, focus_id, sentence_id, answer, distractors, hint

# translations
- helps users search in different languages (version_title, focus_name)
- auto translate for common languages; load as needed and cache for minority
translations: translatable_type, translatable_id, lang_code, field_name, value
languages: id, short_code, native_name, icon_url

# media
images: id, url, uploaded_on, uploaded_by, source_id
audio: id, url, uploaded_on, uploaded_by, source_id

# sources
sources: id, source, attribution, license

# users
users: id, username, email, created_at
preferences: user_id, ui_lang, study_lang, dark_mode, load_images, load_audio, quiz_mode (JSONB in users?)
user_stats: (if db slow to calculate from other tables), user_id, current_streak, longest_streak, xp, last_activity_at

roles: id, name (author {own}, editor {other's}, admin, artist {images})
authors: username (can upload and edit own content)
editors: username (can edit others' content)

# usage
views: user_id, version_id, quiz_mode, score, timestamp
likes: user_id, version_id, is_positive, timestamp
favorite_versions: user_id, version_id
favorite_authors: user_id, author_id
progress: user_id, version_id, last_scene_id, updated_at (reset to 0 after finish)
question_logs: user_id, question_id, is_correct, attempts, response_time_ms
flagged_for_review: table_name, record_id, flagged_by, flagged_on, reason (incorrect, inappropriate, other)

# monetization
subscriptions: id, user_id, began_at, expires_at
purchased_versions: id, user_id, version_id, expires_at
credits: id, user_id, credits_delta, timestamp, note
payments: id, user_id, provider, provider_ref, amount (INT), currency_iso, base_amount, status (pending, completed, refunded)

creators: user_id, tax_id, legal_name, payout_method, payout_details
royalty_earnings: id, creator_id, type (content_purchase or subscription share), version_id, processed_at, amount_cents, status (pending {wait 30 days}, available for withdrawal, requested, processing, paid)
payouts: id, creator_id, amount, timestamp, reference number, status (pending, paid)
   * each month, sum subscription revenue, then divide to creators based on creator_views/all_views
   * set minimum for payout (to avoid fees eating all of $0.50)
   * delay 30 days to account for credit card chargebacks or refunds

# history
- for edits to content, questions, translations, media
- not for users, usage, monetization
changes: id, table_name, record_id, field_name, old_value (JSONB), new_value (JSONB), timestamp, user_id

# gamification
badges: id, slug, xp_reward
user_badges: user_id, badge_id, earned_at
gems: id, slug, credit_reward
user_gems: user_id, gem_id, earned_at
