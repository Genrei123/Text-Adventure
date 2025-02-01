export interface StatCardProps {
    icon: string;
    value: number;
    label?: string;
  }
  
  export interface GenreTagProps {
    name: string;
  }
  
  export interface ActionButtonProps {
    icon: string;
    label: string;
    count?: number;
    onClick?: () => void;
  }

  export interface ReviewPageProps {
      title: string;
      subtitle: string;
      reads: number;
      saves: number;
      comments: number;
      image: string;
  }

  export const defaultStatCardProps: StatCardProps = {
    icon: 'default-icon',
    value: 0,
    label: 'default-label'
  };
  
  export const defaultGenreTagProps: GenreTagProps = {
    name: 'default-genre'
  };
  
  export const defaultActionButtonProps: ActionButtonProps = {
    icon: 'default-icon',
    label: 'default-label',
    count: 0,
    onClick: () => {}
  };
  
  export const defaultReviewPageProps: ReviewPageProps = {
    title: 'Default Title',
    subtitle: 'Default Subtitle',
    reads: 100,
    saves: 100,
    comments: 10,
    image: 'src/assets/posa.jpg'
  };