'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DataTable({ columns, data, onEdit, onInstallmentEdit,onImageEdit, onDelete, onToggleStock,
                  onToggleApproval, isActionLoading }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(item, {
                  onEdit, onInstallmentEdit,onImageEdit,onDelete,
                  onToggleStock,
                  onToggleApproval, isActionLoading
                }) : item[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}