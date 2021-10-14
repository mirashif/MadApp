import {useAppState} from '../StateContext';
import {useMemo} from 'react';
import {Cartable} from '../store/ItemBuilder';

export function useItemBuilder(itemID: string) {
    const store = useAppState();

    const builder = useMemo(() => {
        if (itemID) {
            return new Cartable(store, itemID);
        } else {
            return null;
        }
    }, [itemID, store]);

    return builder
        ? {
              get total() {
                  return builder?.total;
              },
              ready: !!builder,
              cartable: builder.cartable,
              addonCount: builder.addonCount,
              incrementAddon: builder.incrementAddon,
              decrementAddon: builder.decrementAddon,
              clearAddon: builder.clearAddon,
              clearAddons: builder.clearAddons,
              chooseVariant: builder.chooseVariant,
              chosenVariant: builder.chosenVariant,
          }
        : null;
}
