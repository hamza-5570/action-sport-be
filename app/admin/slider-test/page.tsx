'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const imageTypes = ['desktop', 'tablet', 'mobile'] as const;
type ImageType = (typeof imageTypes)[number];

type Slider = {
  _id?: string;
  title: string;
  subtitle: string;
  buttonCaption: string;
  link: string;
  images: {
    [key in ImageType]?: string;
  };
};

const fetchSliderData = async (): Promise<Slider[]> => {
  const res = await fetch('/api/sliders');
  if (!res.ok) throw new Error('Failed to fetch sliders');
  return await res.json();
};

const fetchImageList = async (type: ImageType): Promise<string[]> => {
  const res = await fetch(`/api/images/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type} images`);
  return await res.json();
};

type SliderFormProps = {
  index: number;
  data: Slider;
  onChange: (index: number, updated: Slider) => void;
};

const SliderForm: React.FC<SliderFormProps> = ({ index, data, onChange }) => {
  const [images, setImages] = useState<Record<ImageType, string[]>>({
    desktop: [],
    tablet: [],
    mobile: [],
  });

  useEffect(() => {
    imageTypes.forEach(async (type) => {
      try {
        const list = await fetchImageList(type);
        setImages((prev) => ({ ...prev, [type]: list }));
      } catch (err) {
        console.error(`Error fetching ${type} images`, err);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (type: ImageType, value: string) => {
    onChange(index, {
      ...data,
      images: { ...data.images, [type]: value },
    });
  };

  const handleFileUpload = async (type: ImageType, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/uploads/${type}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('Image upload failed');
        return;
      }

      const result = await res.json();
      const imagePath = result.path;

      // Update list and selection
      setImages((prev) => ({
        ...prev,
        [type]: [...prev[type], imagePath],
      }));
      handleImageChange(type, imagePath);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed');
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Slider {index + 1}</h2>
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input name="title" value={data.title || ''} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input name="subtitle" value={data.subtitle || ''} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="buttonCaption">Button Caption</Label>
          <Input
            name="buttonCaption"
            value={data.buttonCaption || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input name="link" value={data.link || ''} onChange={handleInputChange} />
        </div>

        {imageTypes.map((type) => (
          <div key={type}>
            <Label>{type.charAt(0).toUpperCase() + type.slice(1)} Image</Label>
            <div className="flex gap-2 items-center mt-1">
              <select
                value={data.images?.[type] || ''}
                onChange={(e) => handleImageChange(type, e.target.value)}
                className="flex-1 border p-2 rounded"
              >
                <option value="">-- Select an image --</option>
                {images[type]?.map((img) =>
                  img ? (
                    <option key={img} value={img}>
                      {img.split('/').pop()}
                    </option>
                  ) : null
                )}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(type, e.target.files[0]);
                  }
                }}
                className="block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSliderData()
      .then((data) => setSliders(data))
      .catch((err) => {
        console.error('Failed to load sliders:', err);
      });
  }, []);

  const handleSliderChange = (index: number, updated: Slider) => {
    const updatedSliders = [...sliders];
    updatedSliders[index] = updated;
    setSliders(updatedSliders);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/sliders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sliders),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Sliders updated successfully!');
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Edit Sliders</h1>
      {sliders.map((slider, i) => (
        <SliderForm
          key={slider._id || i}
          index={i}
          data={slider}
          onChange={handleSliderChange}
        />
      ))}
      <Button className="mt-6" onClick={handleSubmit} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save All Changes'}
      </Button>
    </div>
  );
}
