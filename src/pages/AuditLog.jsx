import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { AuditLog as AuditLogDB } from '@/lib/db';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import {
  Search,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Download,
  Brain,
  Lock
} from 'lucide-react';

import { format } from 'date-fns';

const actionIcons = {
  view: Eye,
  create: Plus,
  update: Edit,
  delete: Trash2,
  access_attempt: Lock,
  login: LogIn,
  logout: LogOut,
  export: Download,
  ai_analysis: Brain,
};

const severityStyles = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export default function AuditLog() {

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const {
    data: logs = [],
    isLoading
  } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: AuditLogDB.list
  });

  const filtered = logs
    .filter(
      l => severityFilter === 'all' || l.severity === severityFilter
    )
    .filter(
      l => actionFilter === 'all' || l.action === actionFilter
    )
    .filter(
      l =>
        l.description?.toLowerCase()?.includes(search.toLowerCase()) ||
        l.user_email?.toLowerCase()?.includes(search.toLowerCase()) ||
        l.entity_type?.toLowerCase()?.includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">

      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">
            Audit Log
          </h1>
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          Immutable, time-stamped record of all system actions
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-[200px] max-w-sm">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>

          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="pl-10"
          />

        </div>

        <Select
          value={severityFilter}
          onValueChange={setSeverityFilter}
        >

          <SelectTrigger className="w-36">
            <SelectValue placeholder="Severity"/>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>

        </Select>

        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
        >

          <SelectTrigger className="w-36">
            <SelectValue placeholder="Action"/>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="ai_analysis">AI Analysis</SelectItem>
            <SelectItem value="access_attempt">Access Attempt</SelectItem>
          </SelectContent>

        </Select>

      </div>

      <Card>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead></TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {isLoading ? (

                <TableRow>
                  <TableCell colSpan={7}>
                    Loading...
                  </TableCell>
                </TableRow>

              ) : filtered.length===0 ? (

                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12"
                  >
                    No audit log entries found
                  </TableCell>
                </TableRow>

              ) : (

                filtered.map(log => {

                  const ActionIcon =
                    actionIcons[log.action] || Eye;

                  return (

                    <TableRow key={log.id}>

                      <TableCell>

                        <ActionIcon
                          className="w-4 h-4"
                        />

                      </TableCell>

                      <TableCell>

                        <Badge variant="secondary">

                          {log.action}

                        </Badge>

                      </TableCell>

                      <TableCell>

                        {log.description}

                      </TableCell>

                      <TableCell>

                        {log.entity_type || '-'}

                      </TableCell>

                      <TableCell>

                        {log.user_email || '-'}

                      </TableCell>

                      <TableCell>

                        <Badge
                          variant="outline"
                          className={
                            severityStyles[
                              log.severity
                            ] || ''
                          }
                        >
                          {log.severity}
                        </Badge>

                      </TableCell>

                      <TableCell>

                        {log.created_at
                          ? format(
                              new Date(log.created_at),
                              'MMM d, yyyy HH:mm:ss'
                            )
                          : '-'
                        }

                      </TableCell>

                    </TableRow>

                  );

                })

              )}

            </TableBody>

          </Table>

        </div>

      </Card>

    </div>
  );
}