import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  BookOpen, Users, Bookmark, UserRound, Plus, Search, Bell, Menu,
  MessageCircle, ArrowUpRight, Leaf, ChevronRight, X
} from 'lucide-react';
import './styles.css';

// We'll connect the database after the website preview is built.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

const demoPosts = [
  {
    id: 1,
    category: 'SCRIPTURE STUDY',
    group: 'Come, Follow Me Study',
    title: 'Learning to recognize the quiet ways God answers',
    body: 'I have been thinking about how answers do not always come all at once. Sometimes they come through a verse that stands out, a conversation, or a little more peace than we had yesterday. I would love to hear what has helped you recognize those quieter answers.',
    author: 'A fellow learner',
    date: 'Today',
    comments: 4,
    initials: 'FL'
  },
  {
    id: 2,
    category: 'JESUS CHRIST',
    group: 'Christlike Living',
    title: 'A thought about choosing kindness',
    body: 'One thing I love about the Savior’s example is that He noticed people. A small effort to notice someone who might feel left out can make an ordinary day feel different.',
    author: 'Community member',
    date: 'Yesterday',
    comments: 2,
    initials: 'CM'
  },
  {
    id: 3,
    category: 'GENERAL CONFERENCE',
    group: 'Talks Worth Revisiting',
    title: 'A talk I want to study again',
    body: 'I heard a reminder recently that spiritual growth is often built through small, consistent choices. What talks or teachings have you returned to more than once?',
    author: 'A fellow learner',
    date: '2 days ago',
    comments: 7,
    initials: 'FL'
  }
];

function App() {
  const [active, setActive] = useState('Home');
  const [query, setQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [posts, setPosts] = useState(demoPosts);
  const [saved, setSaved] = useState([]);
  const [notice, setNotice] = useState('Preview mode — the database connection will be added in the next step.');
  const [showMenu, setShowMenu] = useState(false);

  const visiblePosts = posts.filter(p =>
    `${p.title} ${p.body} ${p.group} ${p.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function addPost(title, body) {
    if (!title.trim() || !body.trim()) return;

    setPosts([{
      id: Date.now(),
      category: 'MY STUDY',
      group: 'Your group',
      title,
      body,
      author: 'You',
      date: 'Just now',
      comments: 0,
      initials: 'YO'
    }, ...posts]);

    setShowComposer(false);
    setActive('Home');
    setNotice('Preview post added on this device only. Database publishing comes next.');
  }

  const nav = [
    { label: 'Home', icon: BookOpen },
    { label: 'Groups', icon: Users },
    { label: 'Create', icon: Plus },
    { label: 'Saved', icon: Bookmark },
    { label: 'Profile', icon: UserRound }
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setActive('Home')}>
          <span className="brand-mark"><Leaf size={19} strokeWidth={1.8}/></span>
          <span>EDIFY</span>
        </a>

        <div className="topbar-quote">
          That all may be edified of all <span>— D&C 88:122</span>
        </div>

       <div className="top-actions">
  <button
    className="sign-in-button"
    onClick={() => setShowSignIn(true)}
  >
    Sign in
  </button>

  <button className="icon-button" aria-label="Notifications"
    onClick={() => setNotice('Notifications will be available after account setup.')}>
    <Bell size={19}/>
  </button>

  <button className="avatar small-avatar" aria-label="Profile"
    onClick={() => setActive('Profile')}>E</button>

  <button className="icon-button mobile-menu" aria-label="Menu"
    onClick={() => setShowMenu(!showMenu)}>
    <Menu size={20}/>
  </button>
</div>

        </header>
      <div className="layout">
        <aside className={`sidebar ${showMenu ? 'sidebar-open' : ''}`}>
          <div className="sidebar-label">YOUR SPACE</div>

          <nav>
            {nav.map(({label, icon: Icon}) => (
              <button key={label}
                className={`nav-item ${active === label ? 'active' : ''}`}
                onClick={() => {
                  if (label === 'Create') setShowComposer(true);
                  else setActive(label);
                  setShowMenu(false);
                }}>
                <Icon size={18}/>
                <span>{label}</span>
                {label === 'Create' && <span className="nav-plus">+</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-divider"/>
          <div className="sidebar-label">A PLACE TO GROW</div>

          <div className="sidebar-note">
            <span className="note-icon"><Leaf size={16}/></span>
            <p>Share what you are learning. Make room for what others can teach you.</p>
          </div>

          <div className="sidebar-bottom">
            A thoughtful community for gospel study.
          </div>
        </aside>

        <main className="main-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">A COMMUNITY OF LEARNING</p>
              <h1>
                {active === 'Home' ? 'Grow together.'
                  : active === 'Groups' ? 'Find your people.'
                  : active === 'Saved' ? 'Saved for later.'
                  : active === 'Profile' ? 'Your space.' : active}
              </h1>
              <p className="welcome-sub">
                {active === 'Home'
                  ? 'A place to share what you are studying and learn from one another.'
                  : sectionSubtitle(active)}
              </p>
            </div>

            <button className="primary-button" onClick={() => setShowComposer(true)}>
              <Plus size={17}/> Share a study
            </button>
          </div>

          <div className="notice">
            <span className="notice-dot"/> {notice}
          </div>

          {active === 'Home' && <>
            <div className="toolbar">
              <div className="feed-tabs">
                <span className="feed-tab selected">For you</span>
                <span className="feed-tab">Recent</span>
              </div>

              <label className="searchbox">
                <Search size={17}/>
                <input value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search studies"/>
              </label>
            </div>

            <section className="post-list">
              {visiblePosts.map(post => (
                <article className="post-card" key={post.id}>
                  <div className="post-meta">
                    <span className="category">{post.category}</span>
                    <span className="meta-dot">·</span>
                    <span>{post.group}</span>
                    <span className="meta-spacer"/>
                    <span>{post.date}</span>
                  </div>

                  <h2>{post.title}</h2>
                  <p className="post-body">{post.body}</p>

                  <div className="post-footer">
                    <div className="author">
                      <span className="avatar">{post.initials}</span>
                      <span>{post.author}</span>
                    </div>

                    <div className="post-actions">
                      <button className="post-action"
                        onClick={() => setNotice('Comments will be enabled when the database is connected.')}>
                        <MessageCircle size={16}/>{post.comments} comments
                      </button>

                      <button
                        className={`post-action ${saved.includes(post.id) ? 'saved' : ''}`}
                        onClick={() => setSaved(saved.includes(post.id)
                          ? saved.filter(x => x !== post.id)
                          : [...saved, post.id])}>
                        <Bookmark size={16}/>
                        {saved.includes(post.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {visiblePosts.length === 0 &&
                <div className="empty-state">No studies match that search yet.</div>}
            </section>
          </>}

          {active === 'Groups' && (
            <div className="feature-panel">
              <div className="feature-icon"><Users size={25}/></div>
              <h2>Study is better together.</h2>
              <p>Groups will give members a place to study a topic, share resources, and discuss questions. Public and private groups are part of the next build step.</p>
              <button className="outline-button"
                onClick={() => setNotice('Group creation will be enabled after we finish the database connection.')}>
                Explore groups <ArrowUpRight size={16}/>
              </button>
            </div>
          )}

          {active === 'Saved' && (
            <section className="post-list">
              {posts.filter(p => saved.includes(p.id)).length
                ? posts.filter(p => saved.includes(p.id)).map(p => (
                  <article className="post-card" key={p.id}>
                    <span className="category">{p.category}</span>
                    <h2>{p.title}</h2>
                    <p className="post-body">{p.body}</p>
                  </article>
                ))
                : (
                  <div className="feature-panel">
                    <div className="feature-icon"><Bookmark size={25}/></div>
                    <h2>Keep a thought close.</h2>
                    <p>Save studies you want to revisit. Your saved posts will be private to you.</p>
                  </div>
                )}
            </section>
          )}

          {active === 'Profile' && (
            <div className="feature-panel">
              <div className="avatar profile-avatar">E</div>
              <h2>Your profile starts here.</h2>
              <p>Member profiles will include a photo, display name, short bio, groups, and shared studies. Profile visibility will be limited to people who share a group with you.</p>
              <button className="outline-button"
                onClick={() => setNotice('Profile editing will be enabled after sign-up is connected.')}>
                Edit profile <ChevronRight size={16}/>
              </button>
            </div>
          )}
        </main>

        <aside className="right-rail">
          <div className="rail-card scripture-card">
            <p className="eyebrow">OUR PURPOSE</p>
            <div className="scripture-quote">“That all may be edified of all.”</div>
            <p className="scripture-ref">DOCTRINE & COVENANTS 88:122</p>
            <div className="little-leaf"><Leaf size={18}/></div>
          </div>

          <div className="rail-card">
            <p className="eyebrow">STUDY STARTERS</p>
            <button className="starter" onClick={() => setQuery('Jesus Christ')}>
              Jesus Christ and His teachings <ChevronRight size={15}/>
            </button>
            <button className="starter" onClick={() => setQuery('scripture')}>
              Scripture study <ChevronRight size={15}/>
            </button>
            <button className="starter" onClick={() => setQuery('Conference')}>
              General Conference <ChevronRight size={15}/>
            </button>
          </div>

          <div className="rail-footer">
            Built on faith, curiosity, and kindness.
          </div>
        </aside>
      </div>

{showSignIn && (
  <div className="modal-backdrop" onClick={() => setShowSignIn(false)}>
    <div className="composer-modal sign-in-modal" onClick={e => e.stopPropagation()}>
      <button
        className="close-button"
        onClick={() => setShowSignIn(false)}
        type="button"
      >
        ×
      </button>

      <div className="sign-in-heading">
        <div className="brand-mark">
          <Leaf size={22}/>
        </div>
        <h2>Welcome back</h2>
        <p>That all may be edified of all.</p>
      </div>

      <form onSubmit={e => {
        e.preventDefault();
        setNotice('Account sign-in will be connected in a future step.');
        setShowSignIn(false);
      }}>
        <label>Email address</label>
        <input type="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" required />

        <button className="primary-button" type="submit">
          Sign in
        </button>
      </form>

      <p className="fine-print">
        This is a design preview. Account access is not active yet.
      </p>
    </div>
  </div>
)}
      {showComposer && (
        <div className="modal-backdrop" onClick={() => setShowComposer(false)}>
          <form className="composer-modal"
            onClick={e => e.stopPropagation()}
            onSubmit={e => {
              e.preventDefault();
              addPost(e.target.title.value, e.target.body.value);
            }}>
            <div className="modal-heading">
              <div>
                <p className="eyebrow">SHARE WHAT YOU'RE LEARNING</p>
                <h2>Create a study</h2>
              </div>
              <button type="button" className="icon-button"
                onClick={() => setShowComposer(false)}>
                <X size={20}/>
              </button>
            </div>

            <label className="field-label">
              Title or subject
              <input name="title" required maxLength="120"
                placeholder="What have you been studying?"/>
            </label>

            <label className="field-label">
              Your study
              <textarea name="body" required maxLength="10000" rows="6"
                placeholder="Share a scripture, a thought, a question, or something you learned..."/>
            </label>

            <div className="modal-actions">
              <button type="button" className="outline-button"
                onClick={() => setShowComposer(false)}>Cancel</button>
              <button className="primary-button" type="submit">
                Add preview post <ArrowUpRight size={16}/>
              </button>
            </div>

            <p className="fine-print">
              This first preview saves posts only in this browser session. We’ll connect real member accounts and posting next.
            </p>
          </form>
        </div>
      )}

      <footer className="mobile-nav">
        {nav.map(({label, icon: Icon}) => (
          <button key={label}
            className={active === label ? 'active' : ''}
            onClick={() => label === 'Create'
              ? setShowComposer(true) : setActive(label)}>
            <Icon size={19}/><span>{label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}

function sectionSubtitle(section) {
  if (section === 'Groups') return 'Study alongside people who are learning about the same things.';
  if (section === 'Saved') return 'A quiet place for the posts you want to come back to.';
  if (section === 'Profile') return 'Share a little about yourself and the things you are studying.';
  return 'Share what you are learning.';
}

createRoot(document.getElementById('root')).render(<App />);
