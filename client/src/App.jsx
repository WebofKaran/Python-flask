import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Database, GitBranch, Server, Terminal, Trash2, Workflow, Zap } from 'lucide-react';

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [health, setHealth] = useState(null);
  const [active, setActive] = useState('home');
  const [error, setError] = useState('');

  const completed = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  const load = async () => {
    try {
      const [taskData, healthData] = await Promise.all([api('/api/tasks'), api('/api/health')]);
      setTasks(taskData);
      setHealth(healthData);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const addTask = async (event) => {
    event.preventDefault();
    if (!newTask.trim()) return;
    try {
      await api('/api/tasks', { method: 'POST', body: JSON.stringify({ title: newTask }) });
      setNewTask('');
      await load();
    } catch (err) { setError(err.message); }
  };

  const toggleTask = async (task) => {
    try {
      await api(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });
      await load();
    } catch (err) { setError(err.message); }
  };

  const deleteTask = async (id) => {
    try {
      await api(`/api/tasks/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="site-shell">
      <nav className="nav">
        <div className="brand">Cobutec</div>
        <div className="nav-pill">
          {['home', 'features', 'workflow', 'database'].map((item) => (
            <button key={item} className={active === item ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item)}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <a className="github-link" href="https://github.com/WebofKaran/Python-flask" target="_blank" rel="noreferrer">GitHub <ArrowRight size={15} /></a>
      </nav>

      <main>
        <section className="hero section-anchor" id="home">
          <div className="hero-visual">
            <div className="soft-card card-one">FLASK</div>
            <div className="visual-core">
              <div className="flask-mark">F</div>
              <span>Python backend</span>
            </div>
            <div className="soft-card card-two">REACT</div>
            <div className="soft-card card-three">POSTGRESQL</div>
            <div className="soft-card card-four">JENKINS</div>
            <div className="connector-line line-a" />
            <div className="connector-line line-b" />
            <div className="connector-line line-c" />
          </div>

          <div className="hero-copy">
            <div className="eyebrow"><Zap size={14} /> Full-stack deployment, explained visually</div>
            <h1>Build simply.<br />Deploy automatically.</h1>
            <p>See how React talks to Flask, how Flask talks to PostgreSQL, and how Jenkins turns a Git push into a fresh deployment.</p>
            <div className="hero-actions">
              <button onClick={() => document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' })}>See the workflow <ArrowRight size={17} /></button>
              <a href="https://github.com/WebofKaran/Python-flask" target="_blank" rel="noreferrer">Open repository <ArrowRight size={17} /></a>
            </div>
            <div className="stats">
              <div><strong>4</strong><span>Core technologies</span></div>
              <div><strong>{tasks.length}</strong><span>Live database tasks</span></div>
              <div><strong>{completed}</strong><span>Completed</span></div>
            </div>
          </div>
        </section>

        <section className="workflow section-anchor" id="workflow">
          <div className="section-heading">
            <div><span className="section-kicker">HOW IT WORKS</span><h2>One push. One pipeline.</h2></div>
            <p>Jenkins checks the code, builds the frontend, updates the server, restarts Flask and verifies the API.</p>
          </div>
          <div className="pipeline">
            {[
              [GitBranch, '01', 'GitHub', 'Source code'],
              [Workflow, '02', 'Jenkins', 'Automation'],
              [Terminal, '03', 'Build', 'React production files'],
              [Server, '04', 'Deploy', 'Gunicorn + Nginx'],
              [Database, '05', 'PostgreSQL', 'Persistent data'],
            ].map(([Icon, num, title, text], index) => (
              <div className="pipeline-node" key={title}>
                <div className="node-icon"><Icon size={22} /></div>
                <div className="node-num">{num}</div>
                <strong>{title}</strong>
                <span>{text}</span>
                {index < 4 && <ArrowRight className="pipeline-arrow" size={20} />}
              </div>
            ))}
          </div>
        </section>

        <section className="lab-grid section-anchor" id="features">
          <div className="panel explanation-panel">
            <span className="section-kicker">TECH STACK</span>
            <h2>What each layer does.</h2>
            <div className="tech-list">
              {[
                ['Flask', 'Python API layer', 'Receives browser requests and exposes REST endpoints.'],
                ['React', 'Frontend layer', 'Creates the interactive interface in the browser.'],
                ['PostgreSQL', 'Data layer', 'Stores tasks safely between deployments and restarts.'],
                ['Jenkins', 'Delivery layer', 'Automates test, build, deployment and health checks.'],
              ].map(([name, role, desc]) => <div className="tech-row" key={name}><div><strong>{name}</strong><span>{role}</span></div><p>{desc}</p></div>)}
            </div>
          </div>

          <div className="panel task-panel section-anchor" id="database">
            <div className="panel-top"><div><span className="section-kicker">LIVE POSTGRESQL DEMO</span><h2>Deployment task board.</h2></div><span className={health?.status === 'healthy' ? 'status good' : 'status'}><i /> {health?.status === 'healthy' ? 'API online' : 'Checking'}</span></div>
            <form className="task-form" onSubmit={addTask}><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a deployment task..." /><button>Add task <ArrowRight size={16} /></button></form>
            {error && <div className="error">{error}</div>}
            <div className="task-list">
              {tasks.length === 0 ? <div className="empty">No tasks yet. Add one to test the Flask + PostgreSQL API.</div> : tasks.map((task) => (
                <div className={task.completed ? 'task done' : 'task'} key={task.id}>
                  <button className="check" onClick={() => toggleTask(task)} aria-label="Toggle task">{task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}</button>
                  <span>{task.title}</span>
                  <button className="delete" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer><span>Cobutec deployment lab</span><span>React · Flask · PostgreSQL · Jenkins</span></footer>
    </div>
  );
}

export default App;
