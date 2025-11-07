import { Text } from "@react-email/components";
import { cn } from "@/lib/utils";

interface EmailTextProps extends React.ComponentPropsWithoutRef<typeof Text> {
  content: string;
}

export function CustomText({ content, className, ...props }: EmailTextProps) {
  return (
    <>
      {content.split("\n").map((line, i) =>
        line.trim() === "" ? (
          <br key={i} />
        ) : (
          <Text key={i} className={cn(className)} {...props}>
            {line}
          </Text>
        ),
      )}
    </>
  );
}
