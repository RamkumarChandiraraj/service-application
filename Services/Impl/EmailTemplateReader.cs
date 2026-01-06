using System.IO;

namespace Services.Impl
{
    public static class EmailTemplateReader
    {
        public static string ReadTemplate(string templateName)
        {
            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "EmailTemplates",
                templateName
            );

            return File.ReadAllText(path);
        }
    }
}
