/**
 * @interface IEventListener
 */
interface IEventListener extends HTMLElement {
	target: any;
	addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean): void;
}

export default IEventListener;
