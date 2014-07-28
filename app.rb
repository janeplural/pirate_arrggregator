require 'sinatra'
require 'sinatra/reloader'
require 'sinatra/activerecord'

db = URI.parse('postgres://Jane:pass@localhost/players')

ActiveRecord::Base.establish_connection({
  database: db.path[1..-1],
  adapter: "postgresql"
})

class Player < ActiveRecord::Base
end

get "/" do 
	@players = Player.order(score: :desc).limit(5)

	erb :index
end

post "/add" do
	Player.create(
		name: params[:name],
		score: params[:score]
	)

	redirect "/"
end