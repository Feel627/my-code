import { parseColor } from '@react-stately/color';
import { Box, Button, Dropdown } from '@rocket.chat/fuselage';
import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useDropdownVisibility } from '/client/sidebar/header/hooks/useDropdownVisibility';

import ColorArea from './ColorArea';
import ColorSlider from './ColorSlider';
import { useOutsideClick, useToggle } from '@rocket.chat/fuselage-hooks';

type ColorTokenProps = {
	item: { name: string; token: string; color: string; isDark: boolean; rgb: string };
	position: number;
	disabled?: boolean;
};

const ColorToken = ({ item, position }: ColorTokenProps): ReactElement => {
	const reference = useRef(null);
	const target = useRef(null);
	const [isVisible, toggle] = useToggle(false);

	const [color, setColor] = React.useState(parseColor(item.rgb).toFormat('hsba'));
	const [xChannel, yChannel, zChannel] = color.getColorChannels();

	const openColorPicker = (): void => toggle(true);
	const closeColorPicker = useCallback((): void => {
		setColor(parseColor(item.rgb).toFormat('hsba'));
		toggle(false);
	}, [item.rgb, toggle]);
	const applyColor = (): void => toggle(false);

	useOutsideClick(
		[target, reference],
		useCallback(() => closeColorPicker(), [closeColorPicker]),
	);

	return (
		<>
			{isVisible &&
				createPortal(
					<Dropdown reference={reference} ref={target} key={item.name}>
						<Box pi='x8'>
							<Box fontSize='p2b' fontWeight='p2b' display='flex' justifyContent='center'>
								{item.name}
							</Box>
							<Box display='flex' justifyContent='center' flexDirection='column' mb='x8'>
								<ColorArea aria-labelledby='hsb-label-id-1' value={color} onChange={setColor} xChannel={xChannel} yChannel={yChannel} />
								<ColorSlider channel={zChannel} value={color} onChange={setColor} />
							</Box>
							<Box display='flex' justifyContent='space-between'>
								<Button onClick={closeColorPicker}>Cancel</Button>
								<Button primary onClick={applyColor}>
									Apply
								</Button>
							</Box>
						</Box>
					</Dropdown>,
					document.body,
				)}

			<Box
				key={item.name}
				ref={reference}
				width='120px'
				height='120px'
				backgroundColor={color.toString('rgb')}
				display='flex'
				flexDirection='column'
				justifyContent='space-between'
				flexShrink={0}
				m='x4'
				mis={position === 0 ? '0' : 'x4'}
				p='x8'
				fontSize='10px'
				color={item.isDark ? 'white' : 'black'}
				fontWeight='600'
				onClick={openColorPicker}
				style={{ cursor: 'pointer' }}
			>
				<Box>{item.name}</Box>
				<Box display='flex' justifyContent='space-between'>
					<Box>{color.toString('rgb')}</Box>
					<Box>{item.token}</Box>
				</Box>
			</Box>
		</>
	);
};

export default ColorToken;