import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiGet, apiPost, apiDelete, getToken, logout } from '@/lib/api';
import {
  Search,
  Mail,
  Trash2,
  Check,
  CheckCheck,
  Reply,
  Filter,
  Circle,
  User,
  Menu,
  X,
  Home,
  FolderOpen,
  Wrench,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

type FilterType = 'all' | 'unread' | 'read';

const MessagesAdmin = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();

  const unreadCount = messages.filter(m => !m.read).length;

  const loadMessages = async () => {
    setLoading(true);
    const res = await apiGet('/messages', true);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(search.toLowerCase()) ||
                          msg.email.toLowerCase().includes(search.toLowerCase()) ||
                          msg.message.toLowerCase().includes(search.toLowerCase());

    if (filter === 'unread') return matchesSearch && !msg.read;
    if (filter === 'read') return matchesSearch && msg.read;
    return matchesSearch;
  });

  const markAsRead = async (id: string, current: boolean) => {
    const res = await apiPost(`/messages/${id}/read`, { read: !current }, true);
    if (res.ok) {
      showToast(`Message marqué comme ${!current ? 'lu' : 'non lu'}`, 'success');
      loadMessages();
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    const res = await apiDelete(`/messages/${id}`, true);
    if (res.ok) {
      showToast('Message supprimé', 'success');
      loadMessages();
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const timeAgo = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return formatDistanceToNow(d, { addSuffix: true, locale: fr });
    }
    return format(d, 'dd MMM yyyy à HH:mm', { locale: fr });
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
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio Admin
            </div>
            <Link to="/" className="text-sm flex items-center gap-1 text-slate-600 hover:text-indigo-600">
              <ExternalLink className="w-4 h-4" /> Site
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  SD
                </div>
                <div>
                  <h2 className="text-lg font-bold">Seydou Dianka</h2>
                  <p className="text-xs text-slate-500">Développeur Full-Stack</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {[
                { to: '/admin', icon: Home, label: 'Dashboard', exact: true },
                { to: '/admin/projects', icon: FolderOpen, label: 'Projets' },
                { to: '/admin/services', icon: Wrench, label: 'Services' },
                { to: '/admin/messages', icon: MessageCircle, label: 'Messages', badge: unreadCount },
                { to: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
                { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
              ].map((item) => {
                const Icon = item.icon as any;
                const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto bg-white/30 dark:bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { logout(); navigate('/admin/login'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
        )}

        <div className="lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <Mail className="w-10 h-10" />
                    Boîte de réception
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {unreadCount > 0 ? (
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      'Tous les messages sont lus ✓'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'unread', 'read'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                      filter === f
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f === 'all' && <Filter className="w-4 h-4" />}
                    {f === 'unread' && <Circle className="w-4 h-4 fill-current" />}
                    {f === 'read' && <CheckCheck className="w-4 h-4" />}
                    {f === 'all' ? 'Tous' : f === 'unread' ? 'Non lus' : 'Lus'}
                    {f === 'unread' && unreadCount > 0 && (
                      <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                        <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <Mail className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500 text-lg">
                    {search || filter !== 'all' ? 'Aucun message trouvé' : 'Aucun message pour le moment'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group relative bg-white dark:bg-slate-900 rounded-2xl border ${msg.read ? 'border-slate-200 dark:border-slate-800' : 'border-indigo-300 dark:border-indigo-900 shadow-lg shadow-indigo-500/10'} transition-all hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {getInitials(msg.name)}
                          </div>
                          {!msg.read && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                {msg.name}
                                {!msg.read && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Nouveau</span>}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {msg.email} · <span className="font-medium">{timeAgo(msg.created_at)}</span>
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Votre message sur mon portfolio`}
                            className="p-3 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-900 transition"
                            title="Répondre"
                          >
                            <Reply className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => markAsRead(msg.id, msg.read)}
                            className={`p-3 rounded-xl transition ${msg.read ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/50'}`}
                            title={msg.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                          >
                            {msg.read ? <Check className="w-5 h-5" /> : <CheckCheck className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
};

export default MessagesAdmin;