import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete, getToken, logout } from '@/lib/api';
import { Plus, Search, Edit, Trash2, Eye, Copy, Image, Globe, Clock, ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle, Menu, X, Home, FolderOpen, Wrench, MessageCircle, BarChart3, Settings, LogOut, ExternalLink, Users, TrendingUp, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  repoUrl?: string;
  liveUrl?: string;
  published: boolean;
  featured: boolean;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    const res = await apiGet('/projects');
    if (res.ok) {
      const data = await res.json();
      // map backend fields (snake_case) to frontend shape
      const mapped = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description || '',
        coverImage: p.cover_url || '',
        repoUrl: p.repo_url || '',
        liveUrl: p.live_url || '',
        published: !!p.published,
        featured: !!p.featured,
        technologies: Array.isArray(p.tech_stack) ? p.tech_stack : [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));
      setProjects(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const body = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      tech_stack: technologies.split(',').map(t => t.trim()).filter(Boolean),
      repo_url: repoUrl || undefined,
      live_url: liveUrl || undefined,
      cover_url: coverUrl || undefined,
      published,
      featured,
    };

    const url = editingProject ? `/projects/${editingProject.id}` : '/projects';

    const res = editingProject ? await apiPut(url, body, true) : await apiPost(url, body, true);

    if (res.ok) {
      showToast(editingProject ? 'Projet mis à jour !' : 'Projet créé avec succès !', 'success');
      setModalOpen(false);
      resetForm();
      loadProjects();
    } else {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTechnologies('');
    setPublished(true);
    setFeatured(false);
    setEditingProject(null);
    setRepoUrl('');
    setLiveUrl('');
    setCoverUrl('');
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setTechnologies((project.technologies || []).join(', '));
    setPublished(project.published);
    setFeatured(project.featured);
    setRepoUrl((project as any).repoUrl || '');
    setLiveUrl((project as any).liveUrl || '');
    setCoverUrl(project.coverImage || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce projet ?')) return;
    setDeletingId(id);
    const res = await apiDelete(`/projects/${id}`, true);
    if (res.ok) {
      showToast('Projet supprimé', 'success');
      loadProjects();
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => { /* handled below in sidebarOpen state */ }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Admin
          </div>
          <Link to="/" className="text-sm flex items-center gap-1 text-slate-600 hover:text-indigo-600">
            <ExternalLink className="w-4 h-4" /> Site
          </Link>
        </div>
      </div>

      {/* Sidebar + main layout copied from Dashboard */}
      <aside className={`hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">SD</div>
              <div>
                <h2 className="text-lg font-bold">Seydou Dianka</h2>
                <p className="text-xs text-slate-500">Développeur Full-Stack</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link to="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Projets</span>
            </Link>
            <Link to="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Wrench className="w-5 h-5" />
              <span className="font-medium">Services</span>
            </Link>
            <Link to="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
            <button onClick={() => { logout(); window.location.href = '/admin/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Gestion des Projets</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{projects.length} projet{projects.length > 1 ? 's' : ''} au total</p>
            </div>
            <button onClick={() => { resetForm(); setModalOpen(true); }} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-shadow">
              <Plus className="w-5 h-5" />
              Nouveau projet
            </button>
          </div>

          {/* The rest of the ProjectsAdmin content (search, table, modal, toast) */}

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Rechercher un projet ou une technologie..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              {/* existing table markup reused unchanged */}
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projet</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Technos</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Créé le</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-8">
                          <div className="animate-pulse flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-slate-500">{search ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}</td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {project.coverImage ? (
                              <img src={project.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover shadow-md" />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
                                <Image className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-lg">{project.title}</div>
                              <div className="text-sm text-slate-500">/{project.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {project.published ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"><CheckCircle className="w-3 h-3" /> Publié</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"><Clock className="w-3 h-3" /> Brouillon</span>
                            )}
                            {project.featured && (<span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 text-xs rounded-full font-medium">★ À la une</span>)}
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 4).map((tech) => (<span key={tech} className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 text-xs rounded-lg font-medium">{tech}</span>))}
                            {project.technologies.length > 4 && <span className="text-xs text-slate-500">+{project.technologies.length - 4}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 hidden md:table-cell">{format(new Date(project.createdAt), 'dd MMM yyyy', { locale: fr })}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/projects/${project.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" /></Link>
                            <button onClick={() => openEdit(project)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Edit className="w-4 h-4 text-indigo-600" /></button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition">{deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : <Trash2 className="w-4 h-4 text-red-600" />}</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal (reuse existing modal code) */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre du projet</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Mon super projet React + Node.js" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description courte</label>
                      <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" placeholder="Une brève description visible sur la carte du projet..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies (séparées par des virgules)</label>
                      <input type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="React, Next.js, TypeScript, Tailwind, Prisma" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Repository (URL)</label>
                      <input type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="https://github.com/username/repo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Site en ligne (URL)</label>
                      <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="https://project.example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image de couverture (URL)</label>
                      <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="https://cdn.example.com/cover.jpg" />
                    </div>
                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5 rounded text-indigo-600" /><span className="font-medium">Publié (visible sur le site)</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded text-yellow-600" /><span className="font-medium">À la une</span></label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button onClick={() => { setModalOpen(false); resetForm(); }} className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Annuler</button>
                    <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">{editingProject ? 'Mettre à jour' : 'Créer le projet'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsAdmin;