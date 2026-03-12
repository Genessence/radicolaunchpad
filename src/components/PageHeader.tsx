import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BrandViewSelector } from '@/components/BrandViewSelector';
import { cn } from '@/lib/utils';

export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemConfig[];
  showBack?: boolean;
  backTo?: string;
  showBrandSelector?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  showBack,
  backTo,
  showBrandSelector = true,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.flatMap((item, i) => {
              const node = (
                <BreadcrumbItem key={i}>
                  {i < breadcrumbs!.length - 1 && item.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              );
              return i < breadcrumbs!.length - 1
                ? [node, <BreadcrumbSeparator key={`sep-${i}`} />]
                : [node];
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showBrandSelector && <BrandViewSelector />}
          {actions}
        </div>
      </div>
    </div>
  );
}
