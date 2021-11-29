import styles from './styles.module.scss';
import LogoImage from '../../assets/logo.svg';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

type message = {
	id: string;
	text: string;
	user: {
		name: string;
		avatar_url: string;
	};
};

const messagesQueue: message[] = [];
const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: message) => {
	messagesQueue.push(newMessage);
});

export function MessageList() {
	const [messages, setMessages] = useState<message[]>([]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (messagesQueue.length > 0) {
				setMessages((pervState) =>
					[messagesQueue[0], pervState[0], pervState[1]].filter(Boolean)
				);
				messagesQueue.shift();
			}
		}, 3000);
	}, []);

	useEffect(() => {
		api.get<message[]>('/messages/last3').then((response) => {
			setMessages(response.data);
		});
	}, []);

	return (
		<div className={styles.messageListWrapper}>
			<img src={LogoImage} alt="logo" />
			<ul className={styles.messageList}>
				{messages.map((message) => {
					return (
						<li className={styles.message} key={message.id}>
							<p className={styles.messageContent}>{message.text}</p>
							<div className={styles.messageUser}>
								<div className={styles.userImage}>
									<img src={message.user.avatar_url} alt={message.user.name} />
								</div>
								<span>{message.user.name}</span>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
