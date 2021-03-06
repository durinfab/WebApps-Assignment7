
# The Organization

Starting from its year of founding, BubbleBoba, with its cutting-edge technology for tea production, launched the Taiwanese bubble tea business locally.
Through the constructing of the BubbleBoba trademark and our continuing extensive costumer support, the first store in this city has expanded into our chain of over 70 branches.
This expansion, with our goal of spreading the footsteps of traditional bubble tea to all parts of the country, demonstrates our first step in the undertaking of such a mission.
We guarantee to provide customers the best of quality and service, strictly only using ingredients shipped directly from Taiwan, all of which approved by FDA, to brew you the freshest and most authentic Taiwanese taste in every sip.
We hereby cordially invite you to take delight in the experience with us.

# The App

In times of lockdown it is important to make available services which can be used safely.
With this app we plan to realise a safer environment for our customers who want to order.
The app should provide a medium for customers to easily place an order without standing in a queue in front of the shop.

To underline the social aspect, even in times where social distancing is important, there should be a feature where everyones order should be listed.
That list should offer an option to rate the order of others and sort the orders by rating.

## Title
BubbleBoba

## Domain Name

bubblebobas.shop

## Presentation

https://docs.google.com/presentation/d/1yOjX8_iQwDYHuaC7BzZaFT3Tb4UBfFYlX49FZ4NslH0/edit?usp=sharing

## Information Management Tasks

1. Organize Drinks (liquids / can only be used by employees)
	1) Retrieve Drink	-	Present a list of all liquids available as drink
	2) Create Drink		-	Present a form to create a new drink
	3) Update Drink		-	Present a form to update an existing drink
	4) Delete Drink		-	Present a form to choose a drink to delete


2. Organize Bobas (topping / can only be used by employees)
	1) Retrieve Bobas	-	Present a list of all toppings available as bobas
	2) Create Bobas		-	Present a form to create a new type of bobas
	3) Update Bobas		-	Present a form to update an existing type of bobas
	4) Delete Bobas		-	Present a form to choose a type of bobas to delete
  
3. Organize Boba Teas (liquid + topping / can be used by employees and customers)
	1) Create Custom Boba Teas					- 	Choose from drinks and bobas to create custom order
	2) Display and display Boba Tea Orders with different sorting	-	Present a list of the all orders placed and offer different keyword to sort by (rating, most recent)
	3) Rate Boba Tea						-	Present a list of the all orders placed

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Revised Information Management Tasks

1. Organize Drinks (liquids / can only be used by employees)
	1) Retrieve Drink	-	Present a list of all liquids available as drink
	2) Create Drink		-	Present a form to create a new drink
	3) Update Drink		-	Present a form to update an existing drink
	4) Delete Drink		-	Present a form to choose a drink to delete

	A Drink has the following attributes:
	1) drink-ID (mandatory, unique, constaraint)
	2) name (mandatory, constaraint)		
	3) short description (mandatory, constaraint)


2. Organize Bobas (topping / can only be used by employees)
	1) Retrieve Bobas	-	Present a list of all toppings available as bobas
	2) Create Bobas		-	Present a form to create a new type of bobas
	3) Update Bobas		-	Present a form to update an existing type of bobas
	4) Delete Bobas		-	Present a form to choose a type of bobas to delete

	A Boba has the following attributes:
	1) boba-ID (madatory unique, constaraint)
	2) name (mandatory, constaraint)
	3) short description (mandatory, constaraint)
  
3. Organize Boba Teas (liquid + topping / can be used by employees and customers)
	1) Create Custom Boba Teas					- 	Choose from drinks and bobas to create custom order
	2) Display and display Boba Tea Orders with different sorting	-	Present a list of the all orders placed and offer different keyword to sort by (rating, most recent)
	3) Rate Boba Tea						-	Present a list of the all orders placed

	A Boba Tea has the following attributes: 
	1) drink-Id (madatory, unique, constaraint)
	2) liquid (mandatory)
	3) topping (mandatory)
	4) date (mandatory, constraint)
	5) rating (optional after creation, constraint).				-	Updates itself after each rating and displays the average of all ratings as a value with one decimal place, range between 0 and 5
	
	One Boba Tea contains one drink and one variety of Boba .Adjustments are conceivable.

More information:
- The functionarea for the employes should be protected by a univeral password
- As disign colors are yellow, orange, red preferred

![Domain Model](https://user-images.githubusercontent.com/44813766/123148117-235a4700-d460-11eb-9da2-921ec1312e0f.png)

![Design Model](https://user-images.githubusercontent.com/44813766/123148210-3e2cbb80-d460-11eb-9e98-066917a38f7d.png)

