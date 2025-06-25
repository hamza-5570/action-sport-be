'use client';

import React, { useEffect } from 'react';
import 'swagger-ui-dist/swagger-ui.css';

export default function SwaggerPage() {
  useEffect(() => {
    import('swagger-ui-dist/swagger-ui-es-bundle.js').then(({ default: SwaggerUI }) => {
      SwaggerUI({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
      });
    });
  }, []);

  return <div id="swagger-ui" />;
}
