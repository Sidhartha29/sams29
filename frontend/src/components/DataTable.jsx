import { useState, useMemo, useCallback } from 'react';
import { ChevronUpDownIcon, MagnifyingGlassIcon, ArrowsUpDownIcon } from 'lucide-react';

const DataTable = ({
  columns,
  data = [],
