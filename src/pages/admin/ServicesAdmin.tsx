import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { apiGet, apiPost, apiPut, apiDelete, getToken, logout } from '@/lib/api';
import { Plus, Search, Edit, Trash2, GripVertical, ToggleLeft, ToggleRight, DollarSign, Clock, CheckCircle, Menu, X, Home, FolderOpen, Wrench, MessageCircle, BarChart3, Settings, LogOut, ExternalLink, Users, TrendingUp, Mail } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;        // ex: "💻" ou "RocketLaunch" (lucide name)
  price?: string;      // ex: "À partir de 1500€" ou "Sur devis"
  featured: boolean;
  active: boolean;
  order: number;
}

const ServicesAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();

  const navItems = [
    { to: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { to: '/admin/projects', icon: FolderOpen, label: 'Projets' },
    { to: '/admin/services', icon: Wrench, label: 'Services' },
    { to: '/admin/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
    { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💻');
  const [price, setPrice] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  const popularIcons = ['💻', '🚀', '📱', '🎨', '🔒', '⚡', '🛠️', '📊', '🌐', '🧩', '🔧', '☁️'];

  const loadServices = async () => {
    setLoading(true);
    const res = await apiGet('/services');
    if (res.ok) {
      const data = await res.json();
      setServices(data.sort((a: Service, b: Service) => a.order - b.order));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updated = items.map((item, index) => ({ ...item, order: index }));
    setServices(updated);

    // Sauvegarde l’ordre en base
    await apiPut('/services/reorder', updated.map(s => ({ id: s.id, order: s.order })), true);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const body = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      icon,
      price: price || null,
      featured,
      active,
      order: editingService ? editingService.order : services.length,
    };

    const url = editingService ? `/services/${editingService.id}` : '/services';
    const res = editingService ? await apiPut(url, body, true) : await apiPost(url, body, true);
    if (res.ok) {
      setModalOpen(false);
      resetForm();
      loadServices();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await apiPut(`/services/${id}`, { active: !current }, true);
    loadServices();
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setIcon('💻'); setPrice(''); setFeatured(false); setActive(true);
    setEditingService(null);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setPrice(service.price || '');
    setFeatured(service.featured);
    setActive(service.active);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce service définitivement ?')) return;
    await apiDelete(`/services/${id}`, true);
    loadServices();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-black">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Portfolio Admin</div>
            <Link to="/" className="text-sm flex items-center gap-1 text-slate-600 hover:text-indigo-600"><ExternalLink className="w-4 h-4" /> Site</Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon as any;
                const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
              <button onClick={() => { logout(); navigate('/admin/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}

        <div className="lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des Services
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Personnalisez les offres que vous proposez à vos clients
                </p>
              </div>
              <button
                onClick={() => { resetForm(); setModalOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Nouveau service
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Drag & Drop List */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="services">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {loading ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                            <div className="flex-1 space-y-3">
                              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : filteredServices.length === 0 ? (
                      <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                        Aucun service trouvé
                      </div>
                    ) : (
                      filteredServices.map((service, index) => (
                        <Draggable key={service.id} draggableId={service.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white dark:bg-slate-900 rounded-2xl border ${snapshot.isDragging ? 'shadow-2xl border-indigo-500' : 'border-slate-200 dark:border-slate-800'} transition-all`}
                            >
                              <div className="p-6 flex items-center gap-6">
                                <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab">
                                  <GripVertical className="w-6 h-6" />
                                </div>

                                <div className="text-5xl">{service.icon}</div>

                                <div className="flex-1">
                                  <h3 className="text-xl font-bold flex items-center gap-3">
                                    {service.title}
                                    {service.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 text-xs rounded-full">★ À la une</span>}
                                  </h3>
                                  <p className="text-slate-600 dark:text-slate-400 mt-1">{service.description}</p>
                                  {service.price && (
                                    <div className="flex items-center gap-2 mt-3 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                      <DollarSign className="w-5 h-5" />
                                      {service.price}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleActive(service.id, service.active)}
                                    className={`p-3 rounded-xl transition ${service.active ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} dark:${service.active ? 'bg-emerald-900/50' : 'bg-slate-800'}`}
                                  >
                                    {service.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                  </button>
                                  <button onClick={() => openEdit(service)} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <Edit className="w-5 h-5 text-indigo-600" />
                                  </button>
                                  <button onClick={() => handleDelete(service.id)} className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 transition">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Modal de création/édition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-8">{editingService ? 'Modifier le service' : 'Nouveau service'}</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Icône</label>
                  <div className="grid grid-cols-8 gap-3">
                    {popularIcons.map((ico) => (
                      <button
                        key={ico}
                        onClick={() => setIcon(ico)}
                        className={`text-4xl p-4 rounded-xl transition ${icon === ico ? 'bg-indigo-100 dark:bg-indigo-900 ring-4 ring-indigo-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre du service</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500" placeholder="Développement Full-Stack" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Applications web performantes avec React, Next.js, Node.js..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tarif (optionnel)</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500" placeholder="À partir de 2500€ ou Sur devis" />
                </div>

                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-5 h-5 rounded text-indigo-600" />
                    <span className="font-medium">Service actif (visible sur le site)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded text-yellow-600" />
                    <span className="font-medium">Mettre en avant</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button onClick={() => { setModalOpen(false); resetForm(); }} className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Annuler
                </button>
                <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  {editingService ? 'Mettre à jour' : 'Créer le service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesAdmin;