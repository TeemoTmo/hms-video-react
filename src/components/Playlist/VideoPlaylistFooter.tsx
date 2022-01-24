import React, { useMemo, useState, useRef } from 'react';
import { selectVideoPlaylist } from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { CloseIcon, PlaylistIcon, UploadIcon } from '../Icons';
import { Text } from '../Text';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { Button } from '../Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { PlaylistItem } from './PlaylistItem';
// import { VideoPlaylistClasses } from './VideoPlaylist';


export interface VideoPlaylistFooterClasses {
  root?: string;
  header?: string;
  body?: string;
  footer?: string;
  collapse?: string;
  controls?: string;
  icon?: string;
  sliderContainer?: string;
}

export interface VideoPlaylistItemFooterClasses {
  listItem?: string;
  titleContainer?: string;
  truncate?: string;
  selection?: string;
}

export interface VideoPlaylistFooterProps {
  classes?: VideoPlaylistFooterClasses;
  trigger?: JSX.Element;
  active?: boolean;
  selectedVideos: (arg: any) => void;
}

const defaultClasses = {
  root: 'flex flex-column text-gray-100 dark:text-white',
  header: 'flex justify-between items-center px-3 py-3',
  body: 'flex-1 overflow-y-auto bg-gray-100',
  collapse: 'h-0',
  footer: 'py-2',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
  selection: 'text-brand-main',
};

export const VideoPlaylistFooter = ({
  classes,
  trigger,
  active,
  selectedVideos
}: VideoPlaylistFooterProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoPlaylistFooterClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-videoPlaylist',
      }),
    [],
  );

  // const fileInputRef=useRef();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState(new Array());
  // const [progress, setProgress] = useState(0)
  // selectedVideos = (files) => {}
  const hmsActions = useHMSActions();
  const playlist = useHMSStore(selectVideoPlaylist.list);
  const [open, setOpen] = useState(false);

  const changeHandler = (event: any) => {
    setSelectedFiles(event.target.files);
    selectedVideos(event.target.files ? event.target.files : []);
    console.log(event.target.files);
  };

  // const submitHandler = () => {
  //   let formData = new FormData()

  //   formData.append("file", selectedFiles[0])
  //   axiosInstance.post("/upload_file", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     onUploadProgress: data => {
  //       //Set the progress value to show the progress bar
  //       setProgress(Math.round((100 * data.loaded) / data.total))
  //     },
  //   })
  // }

  return (
    <ContextMenu
      classes={{
        trigger: 'bg-transparent-0',
        root: 'static',
        menu: 'mt-0 py-0 w-60',
        menuItem: 'hover:bg-transparent-0 dark:hover:bg-transparent-0',
      }}
      trigger={
        <Button
          key="videoPlaylist"
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          active={active || open}
        >
          {trigger || <PlaylistIcon onClick={() => setOpen(value => !value)} />}
        </Button>
      }
      onTrigger={value => {
        setOpen(value);
      }}
      menuProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: -48,
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      }}
      menuOpen={open}
      noGutters
    >
      <ContextMenuItem
        label="Playlist"
        key="playlist"
        classes={{
          menuTitleContainer: 'hidden',
          menuItemChildren: 'w-full overflow-hidden mx-0 my-0',
        }}
        closeMenuOnClick={false}
      >
        <div className={styler('root')}>
          <div className={styler('header')}>
            <Text variant="heading" size="sm">
              Playlist
            </Text>
            <Button
              key="videoPlaylistUploadButton"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <UploadIcon />
            </Button>
            <input name="" type="file" accept="video/mp4,video/x-m4v,video/*" ref={fileInputRef} onChange={changeHandler} id="formId" hidden />
            <Button
              key="videoPlaylist"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className={styler('body')}>
            {playlist.map(item => {
              return (
                <PlaylistItem
                  key={item.url}
                  item={item}
                  onClick={async () => {
                    await hmsActions.videoPlaylist.play(item.id);
                    setOpen(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      </ContextMenuItem>
    </ContextMenu >
  );
};