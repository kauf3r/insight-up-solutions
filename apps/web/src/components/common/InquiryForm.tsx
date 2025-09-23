'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Zod validation schema
const inquiryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  company: z.string().optional(),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
  subject: z.string(),
});

// TypeScript interfaces
export interface InquiryFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
}

export interface InquiryFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  title: string;
  subject: string;
  onSubmit: (data: InquiryFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const InquiryForm = React.forwardRef<HTMLFormElement, InquiryFormProps>(
  ({ title, subject, onSubmit, isLoading = false, className, ...props }, ref) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<InquiryFormData>({
      resolver: zodResolver(inquiryFormSchema),
      defaultValues: {
        name: '',
        email: '',
        company: '',
        message: '',
        subject: subject,
      },
    });

    const handleFormSubmit = (data: InquiryFormData) => {
      onSubmit(data);
      reset();
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`space-y-6 ${className || ''}`}
        {...props}
      >
        {/* Form Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">Fill out the form below and we&apos;ll get back to you soon.</p>
        </div>

        {/* Hidden subject field */}
        <input type="hidden" {...register('subject')} value={subject} />

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...register('name')}
            className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Company Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-700">
            Company
          </Label>
          <Input
            id="company"
            type="text"
            placeholder="Enter your company name (optional)"
            {...register('company')}
            disabled={isLoading}
          />
          {errors.company && (
            <p className="text-sm text-red-600" role="alert">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-700">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your needs or questions..."
            rows={5}
            {...register('message')}
            className={errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}
            disabled={isLoading}
          />
          {errors.message && (
            <p className="text-sm text-red-600" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              'Send Message'
            )}
          </Button>
        </div>

        {/* Required fields notice */}
        <p className="text-sm text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      </form>
    );
  }
);

InquiryForm.displayName = 'InquiryForm';

export default InquiryForm;