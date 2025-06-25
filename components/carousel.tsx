/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
//import { createCarousel } from "@/lib/actions/carousel.actions";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  buttoncaption: z.string().min(1),
  url: z.string().min(1),
  link: z.string().min(1),
  isPublished: z.boolean().default(false).optional(),
});

interface CarouselFormProps {
  type: "create" | "update";
  sliderId?: string; // Optional ID for the slider to update
}

export default function CarouselForm({ type, sliderId }: CarouselFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      buttoncaption: "",
      url: "",
      link: "",
      isPublished: false as boolean, // Explicitly define as boolean
    },
  });

  // Fetch slider data if type is "update"
  useEffect(() => {
    if (type === "update" && sliderId) {
      const fetchSliderData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/carousels/${sliderId}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch slider data: ${response.status}`);
          }
          const data = await response.json();
          form.reset(data); // Populate the form with fetched data
        } catch (error) {
          console.error("Error fetching slider data:", error);
          toast.error("Failed to load slider data.");
        }
      };
      fetchSliderData();
    }
  }, [type, sliderId, form]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile && type === "create") {
      toast.error("Please select a file first.");
      return;
    }

    try {
      const jsonData = JSON.stringify(values, null, 2);
      console.log("Form Data:", jsonData);

      if (type === "create") {
        const formData = new FormData();
        formData.append("file", selectedFile!);

        const response = await fetch("http://localhost:3000/api/uploadftp", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setUploadStatus("Upload successful: " + JSON.stringify(result));
        toast.success("Form submitted and file uploaded successfully!");

        const carouselData = {
          ...values,
          url:
            "https://groupmoussa.ma/assets/img/carousels/" + selectedFile!.name,
        };
        // createCarousel(carouselData);
      } else if (type === "update") {
        // Call API to update the slider
        const response = await fetch(
          `http://localhost:3000/api/carousels/${sliderId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to update slider: ${response.status}`);
        }

        toast.success("Slider updated successfully!");

        // Redirection après mise à jour
        window.location.href = "http://localhost:3000/fr/admin/sliders";
      }
    } catch (error) {
      console.error("Operation failed:", error);
      setUploadStatus("Operation failed: " + (error as Error).message);
      toast.error("Failed to submit the form.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de la slide" {...field} />
                </FormControl>
                <FormDescription>Saisir le Titre de la Slide</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sous Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Sous Titre de la slide" {...field} />
                </FormControl>
                <FormDescription>
                  Saisir le Sous Titre de la Slide.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttoncaption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boutton Caption</FormLabel>
                <FormControl>
                  <Input placeholder="Button Caption" {...field} />
                </FormControl>
                <FormDescription>
                  Button Caption (Shop,Voir,Acheter...).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>url</FormLabel>
                <FormControl>
                  <Input placeholder="url" {...field} />
                </FormControl>
                <FormDescription>url de l image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Link" {...field} />
                </FormControl>
                <FormDescription>Link.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as CheckedState | undefined}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>is Published</FormLabel>
                  <FormDescription>.</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div>
            {type === "create" && (
              <input
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept="image/*"
              />
            )}
          </div>

          <Button type="submit">
            {type === "create" ? "Submit & Upload" : "Update"}
          </Button>

          {uploadStatus && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              {uploadStatus}
            </div>
          )}
        </form>
      </Form>
      {type === "create" && selectedFile && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center relative w-full h-96">
            <h1 className="text-3xl font-bold mb-4">Appercu</h1>
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
