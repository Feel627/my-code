import { Meteor } from 'meteor/meteor';

import { settings } from '../../settings/server';
import { config, Drupal } from '../lib/common';

Meteor.startup(() => {
	settings.watch<string>('API_Drupal_URL', (value) => {
		config.serverURL = value;
		Drupal.configure(config);
	});
});
