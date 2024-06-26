import { Button, NativeSelect } from '@mantine/core';
import React from 'react';

import ColorPickerElement from '~/components/ColorPicker/ColorPickerElement';
import { COLOR_PICKERS } from '~/config/constants';
import type { ColorPickerType } from '~/config/types';
import useDefaultParams from '~/store/useDefaultParams';

import { H4, TextP } from '../commonTabComponents';

export default function MenuTabSettings() {

  const defaultParams = useDefaultParams((state) => state.defaultParams);
  const setDefaultParams = useDefaultParams((state) => state.setDefaultParams);

  return (
    <>
      <H4 style={{ marginTop: '1.5rem' }}>Color Picker</H4>
      <TextP style={{ marginBottom: '0.6rem' }}> Choose the default color picker style.</TextP>
      <NativeSelect
        sx={{ marginBottom: '1rem' }}
        key={`color-picker-select-${defaultParams.activeColorPicker}`}
        size="xs"
        data={COLOR_PICKERS.map((colorPicker) => ({
          value: colorPicker,
          label: colorPicker?.replace('Picker', '')?.replace('Github', 'GitHub'),
        }))}
        value={defaultParams.activeColorPicker}
        onChange={(event) => {
          setDefaultParams({
            activeColorPicker: event.target.value as ColorPickerType,
          });
        }}
      />
      <ColorPickerElement type={defaultParams.activeColorPicker} />
      <Button style={{ marginTop: '1.5rem' }} onClick={()=>{
        localStorage.clear()
        window.location.reload();
      }}>LOG OUT</Button>
    </>
  );
}
