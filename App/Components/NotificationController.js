import React, { Component } from 'react';
import { Platform, AppState } from 'react-native';
import {Actions} from 'react-native-router-flux';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm";

export default class NotificationController extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		FCM.requestPermissions(); // for iOS
    	FCM.getFCMToken().then(token => {
     		// console.log("getFCMToken", token);
			this.props.onChangeToken(token);
    	});

	  	this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
		  	// console.log("Notification", notif);

		  	if(notif.local_notification){return;}
		  	if(notif.opened_from_tray){return;}
		  	if(Platform.OS ==='ios'){
				  //optional
				  //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
				  //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
				  //notif._notificationType is available for iOS platfrom
			  	switch(notif._notificationType){
				  	case NotificationType.Remote:
					  	// console.log('Error 3.1');
					  	notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
					  	break;
				  	case NotificationType.NotificationResponse:
					  	// console.log('Error 3.2');
					  	notif.finish();
					  	break;
				  	case NotificationType.WillPresent:
					  	// console.log('Error 3.3');
					  	notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
					  	break;
			  	}

			}
			FCM.presentLocalNotification({
				title: notif.notification.title,
				body: notif.notification.body,
				priority: "high",
				click_action: Actions.DetailNews({title: 'Chi Tiết Tin Tức', data: {idNews: 9}}),
				show_in_foreground: true,
				lights: true,
				icon: '',
				local: true
			});
			FCM.setBadgeNumber(parseInt(notif.notification.badge));
	  	});

	  	this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
		  	// console.log("TOKEN (refreshUnsubscribe)", token);
		  	this.props.onChangeToken(token);
	  	});
	}

	componentWillUnmount() {
		this.notificationListner.remove();
    	this.refreshTokenListener.remove();
	}

	render() {return null;}
}
