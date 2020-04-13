const JavaJDILightTemplate = {
	"package" : "",
	"siteName" : "",
	"nameCase" : "camelCase",
	"typeCase" : "PascalCase",
	"site" : `package {{package}};
	
import com.epam.jdi.light.elements.pageobjects.annotations.*;
import {{package}}.pages.*;

@JSite("{{domain}}")
public class {{siteName}} {
{{pages}} 	
}`,

	"siteElement" : `    @Url("{{url}}") @Title("{{title}}") 
    public static {{type}} {{name}};`,
	"page" : `package {{package}}.pages;

import com.epam.jdi.light.elements.pageobjects.annotations.simple.UI;
import com.epam.jdi.light.elements.composite.*;
import com.epam.jdi.light.ui.html.complex.*;
import com.epam.jdi.light.ui.html.common.*;
import {{package}}.sections.*;

public class {{type}} extends WebPage {
{{elements}}	
}`,
	"pageElementCss" : `    @UI("{{locator}}") public {{type}} {{name}};`,
	"pageElementXPath" : `    @UI("{{locator}}") public {{type}} {{name}};`,
	"pageElementComplex" : `    @J{{type}}({{locators}}) 
	public {{type}} {{name}};`,
	"locatorCss" : `{{type}} = "{{locator}}",`,
	"locatorXPath" : `{{type}} = "{{locator}}",`,
	"section" : `package {{package}}.sections;

import com.epam.jdi.light.elements.pageobjects.annotations.simple.UI;
import com.epam.jdi.light.elements.composite.*;
import com.epam.jdi.light.ui.html.complex.*;
import com.epam.jdi.light.ui.html.common.*;

public class {{type}} extends Section {
{{elements}}	
}`,

	"form" : `package {{package}}.sections;

import com.epam.jdi.light.elements.pageobjects.annotations.simple.UI;
import com.epam.jdi.light.elements.composite.*;
import com.epam.jdi.light.ui.html.complex.*;
import com.epam.jdi.light.ui.html.common.*;
import {{package}}.entities.*;

public class {{type}} extends Form<{{data}}> {
{{elements}}	
}`,
	"data" : `package {{package}}.entities;

import com.epam.jdi.tools.DataClass;

public class {{type}} extends DataClass<{{type}}> {
{{elements}}
}`,
	"dataElement" : `    public String {{name}};`
};

export { JavaJDILightTemplate };
