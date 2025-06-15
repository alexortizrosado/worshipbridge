import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { useDropzone } from 'react-dropzone';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Slide {
  type: 'slide';
  title: string;
  lines: string[];
  template: string;
}

interface Media {
  type: 'media';
  url: string;
}

type PlaylistItem = Slide | Media;

interface Playlist {
  name: string;
  items: PlaylistItem[];
}

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist>({
    name: '',
    items: []
  });

  const { mutate: uploadMedia } = useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await axios.post('/api/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    },
    {
      onSuccess: (url) => {
        setPlaylist(prev => ({
          ...prev,
          items: [...prev.items, { type: 'media', url }]
        }));
      }
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4', '.mov']
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => uploadMedia(file));
    }
  });

  const addSlide = () => {
    setPlaylist(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          type: 'slide',
          title: '',
          lines: [''],
          template: 'default-title-slide'
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setPlaylist(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateSlide = (index: number, field: keyof Slide, value: any) => {
    setPlaylist(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index && item.type === 'slide') {
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  const { mutate: savePlaylist } = useMutation(
    async () => {
      await axios.post('/api/enqueue-command', {
        type: 'create_playlist',
        playlistName: playlist.name,
        items: playlist.items
      });
    },
    {
      onSuccess: () => {
        alert('Playlist saved successfully!');
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create New Playlist
              </h3>
              
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Playlist Name"
                  value={playlist.name}
                  onChange={(e) => setPlaylist(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Playlist Items</h4>
                  <button
                    type="button"
                    onClick={addSlide}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Slide
                  </button>
                </div>

                <div {...getRootProps()} className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <input {...getInputProps()} />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload media</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, MP4 up to 10MB
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {playlist.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      {item.type === 'slide' ? (
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Slide Title"
                            value={item.title}
                            onChange={(e) => updateSlide(index, 'title', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          <textarea
                            placeholder="Slide Content"
                            value={item.lines.join('\n')}
                            onChange={(e) => updateSlide(index, 'lines', e.target.value.split('\n'))}
                            rows={3}
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <img
                            src={item.url}
                            alt="Media"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => savePlaylist()}
                  disabled={!playlist.name || playlist.items.length === 0}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Save Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 