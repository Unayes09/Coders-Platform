import React from 'react';
import { Tab } from '@headlessui/react';
import UsersTab from '../../components/Admin/UsersTab';
import DepotsTab from '../../components/Admin/DepotsTab';
import QuestionsTab from '../../components/Admin/QuestionsTab';
import EventsTab from '../../components/Admin/EventsTab';
import JobsTab from '../../components/Admin/JobsTab';
import StoriesTab from '../../components/Admin/StoriesTab';
import FeedbackTab from '../../components/Admin/FeedbackTab';

const tabs = [
  { name: 'Users', component: <UsersTab /> },
  { name: 'Depots', component: <DepotsTab /> },
  { name: 'Questions', component: <QuestionsTab /> },
  { name: 'Events', component: <EventsTab /> },
  { name: 'Jobs', component: <JobsTab /> },
  { name: 'Stories', component: <StoriesTab /> },
  { name: 'Feedback', component: <FeedbackTab /> },
];

const AdminPage = () => {
  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-white uppercase">Admin Control Panel</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b mb-6">
          {tabs.map((tab) => (
            <Tab key={tab.name} className={({ selected }) =>
              selected ? 'p-2 border-b-2 border-blue-500' : 'p-2'
            }>
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.name}>
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminPage;
