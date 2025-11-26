import { useState } from 'react';
import { usePricing } from './usePricing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const deliveryTypes = [
  { value: 'delivery', label: 'Delivery' },
  { value: 'self_pickup', label: 'Self Pickup' },
];

export function Pricing() {
  const {
    singleResult,
    orderResult,
    singleError,
    orderError,
    isCalculatingSingle,
    isCalculatingOrder,
    runSingleCalculation,
    runOrderCalculation,
    lookupNearestDepot,
    nearestDepot,
    isLoadingNearest,
    destinations,
    lookupDestinations,
    isLoadingDestinations,
  } = usePricing();

  const [singleForm, setSingleForm] = useState({
    productId: '',
    depotId: '',
    quantity: 1,
    destinationState: '',
    destinationCity: '',
    deliveryType: 'delivery',
  });

  const [orderForm, setOrderForm] = useState({
    depotId: '',
    destinationState: '',
    destinationCity: '',
    deliveryType: 'delivery',
    items: [{ productId: '', quantity: 1 }],
  });

  const [nearestForm, setNearestForm] = useState({
    productId: '',
    destinationState: '',
  });
  const [destinationDepotId, setDestinationDepotId] = useState('');

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSingleCalculation({
      productId: singleForm.productId,
      depotId: singleForm.depotId,
      deliveryType: singleForm.deliveryType as 'delivery' | 'self_pickup',
      quantity: Number(singleForm.quantity),
      destinationState: singleForm.destinationState || undefined,
      destinationCity: singleForm.destinationCity || undefined,
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runOrderCalculation({
      depotId: orderForm.depotId,
      deliveryType: orderForm.deliveryType as 'delivery' | 'self_pickup',
      destinationState: orderForm.destinationState || undefined,
      destinationCity: orderForm.destinationCity || undefined,
      items: orderForm.items.map(item => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      })),
    });
  };

  const handleNearestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupNearestDepot({
      productId: nearestForm.productId,
      destinationState: nearestForm.destinationState,
    });
  };

  const handleDestinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupDestinations(destinationDepotId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pricing Intelligence
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate delivery pricing, analyse transport fees and locate viable
            depots.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Single Product Quote
            </h3>
            <p className="text-sm text-gray-500">
              Evaluate the landed cost for a single product.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleSingleSubmit}>
            <Input
              placeholder="Product ID"
              value={singleForm.productId}
              onChange={e =>
                setSingleForm(prev => ({ ...prev, productId: e.target.value }))
              }
              required
            />
            <Input
              placeholder="Source Depot ID"
              value={singleForm.depotId}
              onChange={e =>
                setSingleForm(prev => ({ ...prev, depotId: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="number"
                min={1}
                placeholder="Quantity"
                value={singleForm.quantity}
                onChange={e =>
                  setSingleForm(prev => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                required
              />
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={singleForm.deliveryType}
                onChange={e =>
                  setSingleForm(prev => ({
                    ...prev,
                    deliveryType: e.target.value,
                  }))
                }
              >
                {deliveryTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Destination State"
              value={singleForm.destinationState}
              onChange={e =>
                setSingleForm(prev => ({
                  ...prev,
                  destinationState: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Destination City"
              value={singleForm.destinationCity}
              onChange={e =>
                setSingleForm(prev => ({
                  ...prev,
                  destinationCity: e.target.value,
                }))
              }
            />
            {singleError && (
              <p className="text-sm text-red-500">{singleError}</p>
            )}
            <Button type="submit" disabled={isCalculatingSingle}>
              {isCalculatingSingle ? 'Calculating…' : 'Calculate Price'}
            </Button>
          </form>
          {singleResult && (
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">
                Total Price: ₦{singleResult.totalPrice?.toLocaleString() ?? '0'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Subtotal: ₦{singleResult.subtotal?.toLocaleString() ?? '0'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Transport Fee: ₦
                {singleResult.transportFee?.toLocaleString() ?? '0'}
              </p>
              {singleResult.routeInfo && (
                <p className="text-gray-500 text-xs">
                  Route: Depot {singleResult.routeInfo.sourceDepotId} →{' '}
                  {singleResult.routeInfo.destinationState}
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Basket Quote
            </h3>
            <p className="text-sm text-gray-500">
              Combine multiple items to estimate order totals.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleOrderSubmit}>
            <Input
              placeholder="Depot ID"
              value={orderForm.depotId}
              onChange={e =>
                setOrderForm(prev => ({ ...prev, depotId: e.target.value }))
              }
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Destination State"
                value={orderForm.destinationState}
                onChange={e =>
                  setOrderForm(prev => ({
                    ...prev,
                    destinationState: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Destination City"
                value={orderForm.destinationCity}
                onChange={e =>
                  setOrderForm(prev => ({
                    ...prev,
                    destinationCity: e.target.value,
                  }))
                }
              />
            </div>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              value={orderForm.deliveryType}
              onChange={e =>
                setOrderForm(prev => ({
                  ...prev,
                  deliveryType: e.target.value,
                }))
              }
            >
              {deliveryTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="space-y-3">
              {orderForm.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <Input
                    placeholder="Product ID"
                    value={item.productId}
                    onChange={e =>
                      setOrderForm(prev => {
                        const nextItems = [...prev.items];
                        nextItems[index] = {
                          ...nextItems[index],
                          productId: e.target.value,
                        };
                        return { ...prev, items: nextItems };
                      })
                    }
                    required
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={e =>
                      setOrderForm(prev => {
                        const nextItems = [...prev.items];
                        nextItems[index] = {
                          ...nextItems[index],
                          quantity: Number(e.target.value),
                        };
                        return { ...prev, items: nextItems };
                      })
                    }
                    required
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOrderForm(prev => ({
                    ...prev,
                    items: [...prev.items, { productId: '', quantity: 1 }],
                  }))
                }
              >
                Add Item
              </Button>
            </div>

            {orderError && <p className="text-sm text-red-500">{orderError}</p>}
            <Button type="submit" disabled={isCalculatingOrder}>
              {isCalculatingOrder ? 'Calculating…' : 'Calculate Order'}
            </Button>
          </form>
          {orderResult && (
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">
                Total Price: ₦{orderResult.totalPrice?.toLocaleString() ?? '0'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Subtotal: ₦{orderResult.subtotal?.toLocaleString() ?? '0'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Transport Fee: ₦
                {orderResult.transportFee?.toLocaleString() ?? '0'}
              </p>
              <p className="text-xs text-gray-500">
                Delivery Type: {orderResult.deliveryType?.replace('_', ' ')}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nearest Depot Lookup
            </h3>
            <p className="text-sm text-gray-500">
              Identify the closest qualified depot for a product and
              destination.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleNearestSubmit}>
            <Input
              placeholder="Product ID"
              value={nearestForm.productId}
              onChange={e =>
                setNearestForm(prev => ({ ...prev, productId: e.target.value }))
              }
              required
            />
            <Input
              placeholder="Destination State"
              value={nearestForm.destinationState}
              onChange={e =>
                setNearestForm(prev => ({
                  ...prev,
                  destinationState: e.target.value,
                }))
              }
              required
            />
            <Button type="submit" disabled={isLoadingNearest}>
              {isLoadingNearest ? 'Searching…' : 'Find Depot'}
            </Button>
          </form>
          {nearestDepot && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-1 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white">
                {nearestDepot?.depot?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                State: {nearestDepot?.depot?.state}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Transport Fee: ₦
                {nearestDepot?.transportFee?.toLocaleString() ?? '0'}
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Depot Destinations
            </h3>
            <p className="text-sm text-gray-500">
              View every destination a depot can service with its current
              routes.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleDestinationSubmit}>
            <Input
              placeholder="Depot ID"
              value={destinationDepotId}
              onChange={e => setDestinationDepotId(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoadingDestinations}>
              {isLoadingDestinations ? 'Loading…' : 'Load Destinations'}
            </Button>
          </form>
          {destinations.length > 0 && (
            <ul className="space-y-2 text-sm">
              {destinations.map((destination: any) => (
                <li
                  key={`${destination.destinationState}-${destination.destinationCity ?? 'all'}`}
                  className="flex justify-between rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2"
                >
                  <span>
                    {destination.destinationState} •{' '}
                    {destination.destinationCity || 'All cities'}
                  </span>
                  <span className="font-semibold">
                    ₦{destination.transportFee?.toLocaleString() ?? '0'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
