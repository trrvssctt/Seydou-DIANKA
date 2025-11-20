import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { apiGet } from '@/lib/api';

interface PublicService {
  id: string;
  title: string;
  description?: string;
  icon?: string; // emoji or icon name
}

export const Services = () => {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiGet('/services');
        if (res.ok) {
          const data = await res.json();
          const mapped = data
            .filter((s: any) => s.active !== false)
            .map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.short_desc || s.long_desc || s.description || '',
              icon: s.icon || (s.features && Array.isArray(s.features) ? s.features[0] : undefined),
            }));
          setServices(mapped);
        }
      } catch (e) {
        console.error('Failed to load services', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
            Services
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Des solutions complètes pour donner vie à vos projets digitaux
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => <Card key={i} className="h-48 animate-pulse" />)
            ) : (
              services.map((service) => (
                <Card key={service.id} className="border-2 hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors text-2xl">
                        {service.icon || '🛠️'}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
