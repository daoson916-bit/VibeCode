export function createAssetStore(config, logger) {
  const imageRecords = createImageRecords(config);

  function loadDragonImages() {
    if (typeof Image === 'undefined') {
      logger.log('assetEvents', 'image loading skipped outside browser');
      return imageRecords;
    }

    Object.values(config.assets.dragonImages).forEach((asset) => {
      const image = new Image();
      imageRecords[asset.key] = {
        asset,
        image,
        status: config.assets.imageStatusLoading
      };

      logger.log('assetEvents', 'dragon image loading', {
        key: asset.key,
        path: asset.path,
        warning: asset.licenseWarning
      });

      image.addEventListener(config.assets.imageLoadEvent, () => {
        imageRecords[asset.key].status = config.assets.imageStatusLoaded;
        logger.log('assetEvents', 'dragon image loaded', { key: asset.key, path: asset.path });
      });

      image.addEventListener(config.assets.imageErrorEvent, () => {
        imageRecords[asset.key].status = config.assets.imageStatusError;
        logger.log('assetEvents', 'dragon image failed, using Canvas fallback', { key: asset.key, path: asset.path });
      });

      image.src = asset.path;
    });

    return imageRecords;
  }

  function getDragonImage(assetKey) {
    return getLoadedDragonImage({ imageRecords }, config, assetKey);
  }

  return {
    imageRecords,
    loadDragonImages,
    getDragonImage
  };
}

export function createImageRecords(config) {
  return Object.fromEntries(
    Object.values(config.assets.dragonImages).map((asset) => [
      asset.key,
      {
        asset,
        image: null,
        status: config.assets.imageStatusPending
      }
    ])
  );
}

export function getLoadedDragonImage(assetStore, config, assetKey) {
  const record = assetStore?.imageRecords?.[assetKey];

  if (record?.status !== config.assets.imageStatusLoaded) {
    return null;
  }

  return record.image;
}
