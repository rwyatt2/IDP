import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={`Avatar for ${name}`}
        className={cn('avatar', sizes[size], className)}
      />
    );
  }

  return (
    <div 
      className={cn('avatar', sizes[size], className)}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </div>
  );
}

export interface AvatarGroupProps {
  avatars: Array<{ src?: string; name: string }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const hiddenNames = remaining > 0 
    ? avatars.slice(max).map(a => a.name).join(', ')
    : '';

  return (
    <div 
      className={cn('flex -space-x-2', className)}
      role="group"
      aria-label={`Group of ${avatars.length} people`}
    >
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="ring-2 ring-zinc-900"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'avatar ring-2 ring-zinc-900 bg-zinc-700 text-zinc-300',
            size === 'sm' && 'avatar-sm text-[10px]',
            size === 'md' && 'avatar-md text-xs',
            size === 'lg' && 'avatar-lg text-sm',
            size === 'xl' && 'avatar-xl text-base'
          )}
          role="img"
          aria-label={`${remaining} more: ${hiddenNames}`}
        >
          <span aria-hidden="true">+{remaining}</span>
        </div>
      )}
    </div>
  );
}
