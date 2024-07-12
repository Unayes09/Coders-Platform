import { Select, SelectItem } from "@nextui-org/react";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./LanguageVersions";

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  setValue,
}) => {
  const languages = Object.entries(LANGUAGE_VERSIONS);

  const updateLanguage = (language) => {
    setSelectedLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div>
      <Select classNames="color" label="Select a language" className="max-w-xs">
        {languages &&
          languages.map(([language, version]) => (
            <SelectItem
              key={language}
              textValue={`${language} ${" - "} ${version}`}
              onClick={() => updateLanguage(language)}
            >
              <span
                className={
                  language === selectedLanguage
                    ? "text-blue-400 bg-gray-800 px-2 py-[2px] rounded-lg"
                    : ""
                }
              >
                {language}
              </span>
              &nbsp;
              <span
                className={`${
                  language === selectedLanguage ? "text-black" : "text-gray-500"
                }  ml-1`}
              >
                {version}
              </span>
            </SelectItem>
          ))}
      </Select>
    </div>
  );
};

export default LanguageSelector;
