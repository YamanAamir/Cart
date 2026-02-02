'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Assuming you have a utility for className concatenation

const SearchableSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select...',
  multiple = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter options, excluding already selected ones in multiple mode
  const filteredOptions = options.filter(
    option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!multiple || !value.includes(option.value)),
  );

  // Get selected options for preview
  const selectedOptions = multiple
    ? options.filter(opt => value.includes(opt.value))
    : options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemove = (optionValue) => {
    if (multiple) {
      const newValue = value.filter(val => val !== optionValue);
      onChange(newValue);
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between min-h-[38px] h-auto py-2"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {multiple && selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <div
                key={option.value}
                className="inline-flex items-center bg-muted rounded px-2 py-1 text-sm"
              >
                <span className="truncate max-w-[150px]">{option.label}</span>
                <span
                  className={cn(
                    'ml-1 h-4 w-4 flex items-center justify-center cursor-pointer',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) handleRemove(option.value);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </div>
            ))
          ) : (
            <span className="truncate">
              {multiple
                ? selectedOptions.length === 0
                  ? placeholder
                  : `${selectedOptions.length} selected`
                : selectedOptions
                ? selectedOptions.label
                : placeholder}
            </span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 border shadow-lg bg-background max-h-80">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center justify-between',
                    value.includes(option.value) ? 'bg-muted' : '',
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {value.includes(option.value) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchableSelect;