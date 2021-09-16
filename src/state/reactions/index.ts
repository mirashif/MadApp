import {authReactions} from './auth';
import {userReactions} from './user';
import {referralReactions} from './referrals';
import {storyReactions} from './stories';
import {bannerReactions} from './banners';
import {addressReactions} from './addresses';
import {branchReactions} from './branches';
import {appReactions} from './app';
import {cashbackReactions} from './cashbacks';
import {inviteReactions} from './invites';
import {restaurantReactions} from './restaurants';
import {categoryReactions} from './categories';

import {Store} from '../store';
import {orderReactions} from './orders';

export function initializeReactions(store: Store) {
    appReactions(store);

    authReactions(store);
    userReactions(store);

    referralReactions(store);
    addressReactions(store);
    inviteReactions(store);

    bannerReactions(store);
    storyReactions(store);
    cashbackReactions(store);

    restaurantReactions(store);
    branchReactions(store);
    categoryReactions(store);

    orderReactions(store);
}
