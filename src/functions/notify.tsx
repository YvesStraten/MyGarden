import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from "@tauri-apps/api/notification";

const notify = async (message: string) => {
	let permissionGranted = await isPermissionGranted();
	if (!permissionGranted) {
		const permission = await requestPermission();
		permissionGranted = permission === "granted";
	}
	if (permissionGranted) {
		sendNotification({
			title: "MyGarden info",
			body: `${message}`,
			sound: "default",
		});
	}
};

export default notify;
