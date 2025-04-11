import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Tabs, 
  Tab, 
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import { CSVLink } from 'react-csv';

// Mock data for a client
const mockClient = {
  id: 1,
  name: 'TechCorp',
  industry: 'Technology',
  region: 'North',
  primaryAccountManager: 'John Smith',
  primaryBU: 'Content',
  address: '123 Tech Blvd, San Francisco, CA 94107',
  website: 'www.techcorp.com',
  activeServices: 2,
  potentialServices: 5
};

// Mock data for client contacts
const mockContacts = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane.cooper@techcorp.com',
    phone: '(555) 123-4567',
    role: 'Chief Marketing Officer',
    isPrimary: true
  },
  {
    id: 2,
    name: 'Robert Johnson',
    email: 'robert.johnson@techcorp.com',
    phone: '(555) 987-6543',
    role: 'Marketing Director',
    isPrimary: false
  }
];

// Mock data for client engagements
const mockEngagements = [
  {
    id: 1,
    service: 'Content Strategy',
    startDate: '2022-05-15',
    endDate: null,
    status: 'Active',
    notes: 'Ongoing content strategy and production'
  },
  {
    id: 2,
    service: 'Video Production',
    startDate: '2022-08-01',
    endDate: null,
    status: 'Active',
    notes: 'Quarterly video production for product launches'
  }
];
