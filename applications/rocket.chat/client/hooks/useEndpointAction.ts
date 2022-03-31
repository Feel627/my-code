import { Serialized } from '@rocket.chat/core-typings';
import { useCallback } from 'react';

import type { MatchPathPattern, Method, OperationParams, OperationResult, PathFor } from '@rocket.chat/rest-typings';
import { useEndpoint } from '../contexts/ServerContext';
import { useToastMessageDispatch } from '../contexts/ToastMessagesContext';

export const useEndpointAction = <TMethod extends Method, TPath extends PathFor<TMethod>>(
	method: TMethod,
	path: TPath,
	params: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>> = {} as Serialized<
		OperationParams<TMethod, MatchPathPattern<TPath>>
	>,
	successMessage?: string,
): (() => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>) => {
	const sendData = useEndpoint(method, path);
	const dispatchToastMessage = useToastMessageDispatch();

	return useCallback(async () => {
		try {
			const data = await sendData(params);

			if (successMessage) {
				dispatchToastMessage({ type: 'success', message: successMessage });
			}

			return data;
		} catch (error) {
			dispatchToastMessage({ type: 'error', message: String(error) });
			throw error;
		}
	}, [dispatchToastMessage, params, sendData, successMessage]);
};
