export function createAssetStore(config, logger) {
  const imageRecords = createImageRecords(config);

  function loadImages() {
    if (typeof Image === 'undefined') {
      logger.log('assetEvents', 'image loading skipped outside browser');
      return imageRecords;
    }

    getImageAssets(config).forEach((asset) => {
      const image = new Image();
      imageRecords[asset.key] = {
        asset,
        image,
        status: config.assets.imageStatusLoading
      };

      logger.log('assetEvents', 'image loading', {
        key: asset.key,
        path: asset.path,
        warning: asset.licenseWarning
      });

      image.addEventListener(config.assets.imageLoadEvent, () => {
        imageRecords[asset.key].status = config.assets.imageStatusLoaded;
        logger.log('assetEvents', 'image loaded', { key: asset.key, path: asset.path });
      });

      image.addEventListener(config.assets.imageErrorEvent, () => {
        imageRecords[asset.key].status = config.assets.imageStatusError;
        logger.log('assetEvents', 'image failed, using Canvas fallback', { key: asset.key, path: asset.path });
      });

      image.src = asset.path;
    });

    return imageRecords;
  }

  function getDragonImage(assetKey) {
    return getLoadedDragonImage({ imageRecords }, config, assetKey);
  }

  function getBackgroundImage(assetKey) {
    return getLoadedAssetImage({ imageRecords }, config, assetKey);
  }

  return {
    imageRecords,
    loadImages,
    loadDragonImages,
    getDragonImage,
    getBackgroundImage
  };

  function loadDragonImages() {
    return loadImages();
  }
}

export function createImageRecords(config) {
  return Object.fromEntries(
    getImageAssets(config).map((asset) => [
      asset.key,
      {
        asset,
        image: null,
        status: config.assets.imageStatusPending
      }
    ])
  );
}

export function getImageAssets(config) {
  return [
    ...Object.values(config.assets.dragonImages),
    ...Object.values(config.assets.backgroundImages)
  ];
}

export function getLoadedDragonImage(assetStore, config, assetKey) {
  return getLoadedAssetImage(assetStore, config, assetKey);
}

export function getLoadedAssetImage(assetStore, config, assetKey) {
  const record = assetStore?.imageRecords?.[assetKey];

  if (record?.status !== config.assets.imageStatusLoaded) {
    return null;
  }

  return record.image;
}
