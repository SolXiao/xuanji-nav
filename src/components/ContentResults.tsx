
import React from 'react';
import { NavigationItem } from '@/types/nav';
import { CategorySection } from './CategorySection'; // Assuming same directory or adjust import
import { EmptyState } from './EmptyState';
import { DateTimeWidget } from './DateTimeWidget';

interface ContentResultsProps {
  filteredGroups: Record<string, Record<string, NavigationItem[]>>;
  displayQuery: string;
  getCategoryIcon: (cat: string) => string;
  onDelete: (id: string) => void;
  hasResults: boolean;
}

export const ContentResults: React.FC<ContentResultsProps> = ({
  filteredGroups,
  displayQuery,
  getCategoryIcon,
  onDelete,
  hasResults
}) => {
  return (
    <div className="space-y-16 w-full min-w-0 pb-20">
      <DateTimeWidget />

      {!hasResults ? (
        <EmptyState query={displayQuery} />
      ) : (
        Object.entries(filteredGroups).map(([primaryCategory, subGroups]) => (
          <div
            key={primaryCategory}
            id={`category-${primaryCategory}`}
            className="category-section-wrapper scroll-mt-[100px]" // Adjusted scroll margin for sticky header
            data-category={primaryCategory}
          >
            <CategorySection
              primaryCategory={primaryCategory}
              subGroups={subGroups}
              getCategoryIcon={getCategoryIcon}
              searchQuery={displayQuery}
              onDelete={onDelete}
            />
          </div>
        ))
      )}
    </div>
  );
};
