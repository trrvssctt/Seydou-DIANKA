import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getToken } from '@/lib/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X, Home, FolderOpen, Wrench, MessageCircle, BarChart3, Settings, LogOut, ExternalLink, Users, Calendar, TrendingUp, Mail } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();

  // Données mock pour les graphiques (à remplacer par tes vraies stats API plus tard)
  const projectStats = [
    { month: 'Jan', projets: 2 },
    { month: 'Fév', projets: 3 },
    { month: 'Mar', projets: 5 },
    { month: 'Avr', projets: 4 },
    { month: 'Mai', projets: 7 },
    { month: 'Juin', projets: 9 },
  ];

  const techDistribution = [
    { name: 'React/Next.js', value: 45, color: '#06B6D4' },
    { name: 'Node.js', value: 30, color: '#10B981' },
    { name: 'TypeScript', value: 15, color: '#8B5CF6' },
    { name: 'Autres', value: 10, color: '#F59E0B' },
  ];

  const messagesStats = { total: 24, nonLus: 5, cetteSemaine: 8 };

  const navItems = [
    { to: '/admin', icon: Home, label: 'Dashboard', exact: true },
    { to: '/admin/projects', icon: FolderOpen, label: 'Projets' },
    { to: '/admin/services', icon: Wrench, label: 'Services' },
    { to: '/admin/messages', icon: MessageCircle, label: 'Messages', badge: messagesStats.nonLus },
    { to: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
    { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  const statsCards = [
    { title: 'Projets publiés', value: '23', change: '+12%', icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
    { title: 'Messages non lus', value: messagesStats.nonLus, change: '+3 aujourd’hui', icon: Mail, color: 'from-amber-500 to-orange-500', badge: true },
    { title: 'Vues ce mois-ci', value: '3,248', change: '+28%', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { title: 'Taux de conversion', value: '4.8%', change: '+1.2%', icon: Users, color: 'from-purple-500 to-pink-500' },
  ];

  return (
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
          {/* Logo & User */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);
              
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
                    <span className="ml-auto bg-white/30 dark:bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
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

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 px-4 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Suivez les performances de votre portfolio en temps réel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.badge && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs rounded-full">Nouveau</span>}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Évolution des projets */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Évolution des projets ajoutés
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="projets" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition technologies */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Technologies les plus utilisées
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={techDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {techDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {techDistribution.map((tech) => (
                  <div key={tech.name} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{tech.name}</span>
                    <span className="ml-auto font-semibold">{tech.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/admin/projects/create" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
              + Nouveau projet
            </Link>
            <Link to="/admin/messages" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold hover:shadow transition flex items-center gap-2">
              Voir les messages
            </Link>
            <Link to="/" className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold hover:shadow transition flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Voir le site public
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;