import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,582</div>
            <p className="text-xs text-muted-foreground">Items in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.9M</div>
            <p className="text-xs text-muted-foreground">
              Total value of inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Turnover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.82</div>
            <p className="text-xs text-muted-foreground">Times per year</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Cement Depot Admin</CardTitle>
          <CardDescription>
            Manage your inventory, orders, and customer data from this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a demo dashboard page. You can add more features and pages
              as needed.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Add new inventory item</li>
                  <li>• Process orders</li>
                  <li>• View customer analytics</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• 5 new orders today</li>
                  <li>• 3 items low in stock</li>
                  <li>• 12 customers registered</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
