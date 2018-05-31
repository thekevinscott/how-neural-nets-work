import base from './base.json';

const getSpec = ({
  spec,
  data,
  ...props,
}) => {
  if (spec) {
    return {
      ...spec,
      ...props,
    };
  } else if (data && (data[0] && !data[0].values)) {
    return {
      ...base,
      ...props,
      data: [
        {
          name: "source",
          values: data,
        },
      ],
    };
  }

  return {
    ...base,
    ...props,
  };
};

export default getSpec;
