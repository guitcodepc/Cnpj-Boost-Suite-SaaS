import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CNPJStats } from '@/types/cnpj';
import { Building2, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: CNPJStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total CNPJs',
      value: stats.total,
      icon: Building2,
      className: 'bg-gradient-card border-primary/20'
    },
    {
      title: 'Enriquecidos',
      value: stats.enriched,
      icon: CheckCircle,
      className: 'bg-gradient-card border-success/20'
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      className: 'bg-gradient-card border-warning/20'
    },
    {
      title: 'Erros',
      value: stats.errors,
      icon: AlertCircle,
      className: 'bg-gradient-card border-destructive/20'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`${card.className} shadow-soft hover:shadow-elevated transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              {index === 1 && stats.total > 0 && (
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {Math.round((stats.enriched / stats.total) * 100)}% concluído
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};