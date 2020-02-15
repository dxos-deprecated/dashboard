//
// Copyright 2020 DxOS
//

import superagent from 'superagent';

// https://visionmedia.github.io/superagent
export const request = async url => superagent.get(url)
  .then(({ body }) => {
    return ({ result: body });
  })
  .catch(({ response: { body: { error } } }) => {
    return ({ error });
  });
