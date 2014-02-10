OSUPortal::Application.routes.draw do
  resources :flavors


  devise_for :users

  resources :volumes
  resources :volumes do
    collection do
      post 'delete'
      post 'mount'
    end
  end

  resources :flavors
  resources :rules
  resources :floating_ips

  resources :floating_ips do
    collection do
      post 'addPublicIP'
      post 'addPrivageIP'
      post 'releasePublicIP'
      post 'releasePrivateIP'
      post 'bindIPtoServer'
      post 'unbindIPtoServer'
    end
  end

  resources :securities
  
  resources :securities do
    collection do
      post 'delete'
    end
  end

  resources :images

  resource :images do
    collection do
      post 'delete'
      end
  end

  resources :os_types


  resources :operating_systems


  # get "hosts/new"
  resources :hosts

  resources :hosts do
    collection do
      post 'start'
      post 'shutdown'
      post 'softreboot'
      post 'hardreboot'
      post 'emergency_login'
      post 'create_image'
      post 'upgrade'
      post 'reinstall'
      post 'delete'
    end
  end

  # # made by myself before use devise
  # resources :users
  # resources :sessions, only: [:new, :create, :destroy]
 
  # # get "users/new"
  # match '/signup', to: 'users#new'
  # match '/signin',  to: 'sessions#new'
  # match '/signout', to: 'sessions#destroy', via: :delete

  get "site_skel/home"
  match '/home', to: 'site_skel#home'

  get "site_skel/product"
  match '/product', to: 'site_skel#product'
  
  get "site_skel/about"
  match '/about', to: 'site_skel#about'

  get "site_skel/contact"
  match '/contact', to: 'site_skel#contact'

  match '/', to: 'site_skel#home'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'site_skel#home'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
