import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from "./features/dashboard/components/Header";
import { BalanceHeader } from "./features/dashboard/components/BalanceHeader";
import { SpendingForecast } from "./features/dashboard/components/SpendingForecast";
import { SubscriptionWidgets } from "./features/dashboard/components/SubscriptionWidgets";
import { ExpensesBreakdown } from "./features/dashboard/components/ExpensesBreakdown";
import { TransactionsList } from "./features/dashboard/components/TransactionsList";
import { SubscriptionsView } from "./features/dashboard/components/SubscriptionsView";
import { WeeklyInsightsStories } from "./features/insights/components/WeeklyInsightsStories";
import { BottomNav, type ViewType } from "./components/BottomNav";
import { SettingsView } from "./features/settings/components/SettingsView";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen bg-background text-primary pb-40 relative overflow-x-hidden">
      {/* 
        Header is global or specific to Dashboard? 
        Usually Header stays or changes. 
        In the reference prompt, "Header, Balance, Forecast" are "current content" to move.
        Let's render Header only on 'dashboard' (Home) provided it matches the design. 
        Actually, let's keep it simple: conditional rendering based on view.
      */}

      <main className="h-full">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col min-h-full"
            >
              <Header />
              <div className="flex flex-col gap-6 px-6 pt-6 pb-32">
                <BalanceHeader />
                <SpendingForecast />
                <SubscriptionWidgets />
                <ExpensesBreakdown />
                <TransactionsList />
              </div>
            </motion.div>
          )}

          {currentView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 mt-2"
            >
              <SubscriptionsView />
            </motion.div>
          )}

          {currentView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="px-6 mt-6 h-[80vh]"
            >
              <WeeklyInsightsStories />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav
        currentView={currentView}
        onChangeView={setCurrentView}
      />
    </div>
  )
}

export default App