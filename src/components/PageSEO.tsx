import Head from 'next/head';
import React from 'react';

import metadata from '~/config/metadata';

interface Props {
  title?: string;
}

export default function PageSEO({ title}: Props) {
  const curatedTitle = title || `${metadata.website.name}`;

  return (
    <Head>
      <title>{curatedTitle}</title>
      <meta itemProp="name" content={curatedTitle} />

    </Head>
  );
}
