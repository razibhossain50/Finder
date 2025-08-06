'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@heroui/react';
import { Eye, Calendar, User } from 'lucide-react';

interface Connection {
  id: number;
  biodataId: number;
  tokensUsed: number;
  status: string;
  createdAt: string;
  biodata: {
    id: number;
    fullName: string;
    biodataType: string;
    age: number;
    profession: string;
    profilePicture?: string;
  };
}

export const ConnectionHistory = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) return;

      const response = await fetch('/api/connections/my-connections', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBiodata = (biodataId: number) => {
    window.open(`/profile/biodatas/${biodataId}`, '_blank');
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="animate-pulse">Loading connections...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">My Connections</h3>
        </div>
      </CardHeader>
      <CardBody>
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-default-300 mx-auto mb-2" />
            <p className="text-default-500">No connections yet</p>
            <p className="text-sm text-default-400">
              Purchase biodata contact information to see your connections here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={connection.biodata.profilePicture}
                      name={connection.biodata.fullName}
                      size="md"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {connection.biodata.fullName}
                      </h4>
                      <p className="text-sm text-default-500">
                        {connection.biodata.biodataType} • {connection.biodata.age} years • {connection.biodata.profession}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-default-400" />
                        <span className="text-xs text-default-400">
                          Connected on {new Date(connection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      color={connection.status === 'active' ? 'success' : 'default'}
                      variant="flat"
                      size="sm"
                    >
                      {connection.status}
                    </Chip>
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => handleViewBiodata(connection.biodataId)}
                      startContent={<Eye className="w-3 h-3" />}
                    >
                      View
                    </Button>
                  </div>
                </div>
                <Divider className="mt-4" />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};