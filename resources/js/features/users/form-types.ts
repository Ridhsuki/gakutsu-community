export interface UserFormLike<TForm> {
    data: TForm;
    errors: Partial<Record<keyof TForm, string>>;
    processing: boolean;
    setData: <K extends keyof TForm>(key: K, value: TForm[K]) => void;
}
